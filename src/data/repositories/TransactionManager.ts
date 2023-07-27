import { uniqueId } from 'lodash';
import { ClientSession } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

export interface ITransactionManager {
  useTransaction <Response>(
    callback: (sessionId: string) => Promise<Response>,
    existingSessionId?: string,
  ): Promise<Response>;
  useSuccessfulCommitEffect(effect: () => Promise<void>, sessionId: string | undefined): Promise<void>;
  findById(sessionId: string | undefined): ClientSession | undefined;
}

type TransactionSession = {
  [id in string]: ClientSession;
}

@Injectable()
export default class TransactionManager implements ITransactionManager {
  constructor(
    @InjectConnection() private readonly connection: Connection,
  ) {}

  private sessions: TransactionSession = {};
  private successfulCommitEffectsBySessionId: Record<string, Array<() => Promise<void>>> = {};

  public async useTransaction<Response>(callback: (sessionId: string) => Promise<Response>, existingSessionId?: string) {
    // If sessionId exists - do not create a new session
    if (existingSessionId) {
      return callback(existingSessionId);
    }

    const session = await this.connection.startSession();

    let response: Response;

    const uuid = uniqueId();

    this.sessions[uuid] = session;

    try {
      await session.withTransaction(async () => {
        // Clear effects if retry happens
        delete this.successfulCommitEffectsBySessionId[uuid];

        response = await callback(uuid);
      });

      return response!;
    } finally {
      delete this.sessions[uuid];
      delete this.successfulCommitEffectsBySessionId[uuid];

      session.endSession();
    }
  }

  public async useSuccessfulCommitEffect(effect: () => Promise<void>, sessionId: string | undefined) {
    // Apply effect immediately if sessionId is undefined or session is not registered.
    if (!sessionId || !this.sessions[sessionId]) {
      await effect();

      return;
    }

    if (!this.successfulCommitEffectsBySessionId[sessionId]) {
      this.successfulCommitEffectsBySessionId[sessionId] = [];
    }

    this.successfulCommitEffectsBySessionId[sessionId].push(effect);
  }

  private async runSuccessfulCommitEffects(sessionId: string) {
    const effects = this.successfulCommitEffectsBySessionId[sessionId];

    if (!effects?.length) {
      return;
    }

    for (const effect of effects) {
      await effect();
    }
  }

  public findById(sessionId: string | undefined) {
    return sessionId === undefined ? undefined : this.sessions[sessionId];
  }
}
