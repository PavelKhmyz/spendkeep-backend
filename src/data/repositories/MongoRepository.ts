import { ReadPreferenceMode } from 'mongodb';
import mongoose, { AnyKeys, SortOrder } from 'mongoose';
import IPaginationParams, { IPaginationLimitParams } from '../types/PaginationParams';
import { ITransactionManager } from './TransactionManager';
import createDuplicatedMongoErrorHandler from '../utils/createDuplicatedMongoErrorHandler';
import { IUpdateManyOptions, IUpdateOneOptions, ICopyResult } from '../types/Repository';
import swallowCopy from '../../helpers/swallowCopy';
import { Inject, Injectable } from '@nestjs/common';
import RepositoryType from './RepositoryType';
import BaseModel from '../models/BaseModel';
import SortDirection from '../../enums/SortDirection';

type GetFindParams<Configuration> = Configuration extends {
  findParams: infer FindParams
} ? FindParams : Record<string, never>;

type GetCreateParams<Configuration> = Configuration extends {
  createParams: infer CreateParams
} ? CreateParams : Record<string, never>;

type GetUpdateParams<Configuration> = Configuration extends {
  updateParams: infer UpdateParams
} ? UpdateParams : Record<string, never>;

type GetViewModel<Configuration> = Configuration extends {
  viewModel: infer ViewModel
} ? ViewModel : never;

type GetCopyResultViewModel<Configuration> = Configuration extends {
  copyResultViewModel: infer CopyResultViewModel;
} ? CopyResultViewModel : string;

type GetSortField<Configuration> = Configuration extends {
  sortField: infer SortField;
} ? SortField : string;

export interface IBaseMongoRepositoryConfiguration {
  viewModel: unknown;
  copyResultViewModel?: unknown;
  findParams?: unknown;
  createParams?: unknown;
  updateParams?: unknown;
  sortField?: unknown;
}

interface IReadOptionsConfiguration {
  findMany?: ReadPreferenceMode;
  findOne?: ReadPreferenceMode;
}

interface IDiskUsageConfiguration {
  findMany?: boolean;
}

export type IBaseMongoRepositoryOptions<
  Configuration extends IBaseMongoRepositoryConfiguration,
  Document
> = {
  model: mongoose.Model<Document>;
  transformCreateParamsToModel?: (
    params: GetCreateParams<Configuration>,
  ) => AnyKeys<Document> | Promise<AnyKeys<Document>>;
  transformUpdateParamsToQuery?: (
    params: GetUpdateParams<Configuration>,
  ) => mongoose.UpdateQuery<Document> | Promise<mongoose.UpdateQuery<Document>>;
  transformCopyParamsToAttributes?: (
    document: Document,
    params: Partial<GetCreateParams<Configuration>>,
  ) => Partial<AnyKeys<Document>> | Promise<AnyKeys<Document>>;
  getDefaultPopulationOptionsFromFindParams?: (params: GetFindParams<Configuration>) => Array<mongoose.PopulateOptions>;
  getDefaultPopulationOptionsFromCreateParams?: (params: GetCreateParams<Configuration>) => Array<mongoose.PopulateOptions>;
  staticPopulationOptions?: Array<mongoose.PopulateOptions>;
  defaultProjection?: mongoose.ProjectionFields<Document>;
  getModelTypeFromUpdateParams?: (params: GetUpdateParams<Configuration>) => mongoose.Model<Document> | null;
  readOptions?: IReadOptionsConfiguration;
  diskUsageConfiguration?: IDiskUsageConfiguration;
  defaultCopySortQuery?: { [key: string]: SortOrder };
  defaultDeleteItemsWithLimitsSortQuery?: { [key: string]: SortOrder };
}

export interface IWithCopyResultViewModelOptions<
  Configuration extends IBaseMongoRepositoryConfiguration,
  DefaultDocument
> extends IBaseMongoRepositoryOptions<Configuration, DefaultDocument> {
  mapDocumentToCopyResultViewModel: (document: DefaultDocument) => GetCopyResultViewModel<Configuration>;
}

export interface IWithCopyAttributeKeyOptions<
  Configuration extends IBaseMongoRepositoryConfiguration,
  DefaultDocument
> extends IBaseMongoRepositoryOptions<Configuration, DefaultDocument> {
  copyAttributeKey?: keyof DefaultDocument;
}

export type IMongoRepositoryOptions<
  Configuration extends IBaseMongoRepositoryConfiguration,
  DefaultDocument
> = Configuration extends {
  copyResultViewModel: unknown
} ? IWithCopyResultViewModelOptions<Configuration, DefaultDocument>
  : IWithCopyAttributeKeyOptions<Configuration, DefaultDocument>;

@Injectable()
export default abstract class MongoRepository<
  Configuration extends IBaseMongoRepositoryConfiguration,
  Document extends BaseModel,
  PopulatedDocument = Document,
> {
  @Inject(RepositoryType.TransactionManager)
  protected transactionManager: ITransactionManager;

  protected constructor(
    private options: IMongoRepositoryOptions<Configuration, Document>,
  ) {
    this.mapToDefaultViewModel = this.mapToDefaultViewModel.bind(this);

    this.createOne = createDuplicatedMongoErrorHandler(this.createOne.bind(this));
    this.createMany = createDuplicatedMongoErrorHandler(this.createMany.bind(this));
    this.updateOneBy = createDuplicatedMongoErrorHandler(this.updateOneBy.bind(this));
    this.updateManyBy = createDuplicatedMongoErrorHandler(this.updateManyBy.bind(this));
    this.copyMany = createDuplicatedMongoErrorHandler(this.copyMany.bind(this));
    this.saveMany = createDuplicatedMongoErrorHandler(this.saveMany.bind(this));
  }

  public findMany(params: GetFindParams<Configuration> & IPaginationParams<GetSortField<Configuration>>, sessionId?: string) {
    return this.runFindManyWithConfiguration<PopulatedDocument, GetViewModel<Configuration>>(
      params,
      this.mapToDefaultViewModel,
      [
        ...(this.options.getDefaultPopulationOptionsFromFindParams?.(params) || []),
        ...(this.options.staticPopulationOptions || []),
      ],
      this.options.defaultProjection,
      sessionId,
    );
  }

  public findOneBy(params: GetFindParams<Configuration>, sessionId?: string) {
    return this.runFindOneWithConfiguration<PopulatedDocument, GetViewModel<Configuration>>(
      params,
      this.mapToDefaultViewModel,
      [
        ...(this.options.getDefaultPopulationOptionsFromFindParams?.(params) || []),
        ...(this.options.staticPopulationOptions || []),
      ],
      this.options.defaultProjection,
      sessionId,
    );
  }

  public async countBy(params: GetFindParams<Configuration>, sessionId?: string) {
    return this.options.model
      .countDocuments(this.getFindQuery(params))
      .session(this.transactionManager.findById(sessionId) || null);
  }

  public async existsBy(params: GetFindParams<Configuration>, sessionId?: string) {
    return !!(await this.options.model
      .exists(this.getFindQuery(params))
      .session(this.transactionManager.findById(sessionId) || null));
  }

  public async createOne(params: GetCreateParams<Configuration>, sessionId?: string) {
    return this.runCreateOneWithConfiguration<PopulatedDocument, GetViewModel<Configuration>>(
      params,
      this.mapToDefaultViewModel,
      [
        ...(this.options.getDefaultPopulationOptionsFromCreateParams?.(params) || []),
        ...(this.options.staticPopulationOptions || []),
      ],
      sessionId,
    );
  }

  public async createMany(params: GetCreateParams<Configuration>[], sessionId?: string) {
    return this.runCreateManyWithConfiguration<PopulatedDocument, GetViewModel<Configuration>>(
      params,
      this.mapToDefaultViewModel,
      sessionId,
    );
  }

  public async saveMany(params: Array<GetCreateParams<Configuration>>, sessionId?: string) {
    const insertParams = await Promise.all(params.map((createOneEntityParams) => {
      return Promise.resolve(this.options.transformCreateParamsToModel?.(createOneEntityParams) || createOneEntityParams);
    }));

    await this.options.model.insertMany(
      insertParams,
      { session: this.transactionManager.findById(sessionId), lean: true, rawResult: true },
    );
  }

  public async updateOneBy(
    findParams: GetFindParams<Configuration>,
    params: GetUpdateParams<Configuration>,
    options?: IUpdateOneOptions,
  ) {
    return this.runUpdateOneWithConfiguration<PopulatedDocument, GetViewModel<Configuration>>(
      findParams,
      params,
      this.mapToDefaultViewModel,
      [
        ...(this.options.getDefaultPopulationOptionsFromFindParams?.(findParams) || []),
        ...(this.options.staticPopulationOptions || []),
      ],
      this.options.defaultProjection,
      options,
    );
  }

  public async updateManyBy(
    findParams: GetFindParams<Configuration>,
    params: GetUpdateParams<Configuration>,
    options?: IUpdateManyOptions,
  ) {
    const updateQueryPromise = Promise.resolve(this.options.transformUpdateParamsToQuery?.(params) || params);

    await this.options.model.updateMany(
      this.getFindQuery(findParams),
      (await updateQueryPromise) as unknown as mongoose.UpdateQuery<Document>,
      { session: this.transactionManager.findById(options?.sessionId), timestamps: options?.timestamps },
    );
  }

  public async deleteOneBy(params: GetFindParams<Configuration>, sessionId?: string) {
    await this.options.model
      .deleteOne(this.getFindQuery(params))
      .session(this.transactionManager.findById(sessionId) || null);
  }

  public async deleteManyBy(params: GetFindParams<Configuration>, sessionId?: string) {
    await this.options.model
      .deleteMany(this.getFindQuery(params))
      .session(this.transactionManager.findById(sessionId) || null);
  }

  public async deleteManyWithLimits(params: GetFindParams<Configuration> & IPaginationLimitParams, sessionId?: string) {
    const documents = await this.options.model.find(this.getFindQuery(params), { _id: 1 }, {
      skip: params.offset,
      limit: params.count,
    }).sort(this.options.defaultDeleteItemsWithLimitsSortQuery).lean();

    await this.options.model.deleteMany({
      _id: { $in: documents.map((document) => document._id) },
    }, {
      session: this.transactionManager.findById(sessionId),
    });
  }

  public async copyMany(
    findParams: GetFindParams<Configuration> & IPaginationLimitParams,
    copyParams: Partial<GetCreateParams<Configuration>>,
    sessionId?: string,
  ): Promise<ICopyResult<GetCopyResultViewModel<Configuration>>> {
    return this.runCopyManyWithConfiguration(
      findParams,
      async (document) => {
        return this.options.transformCopyParamsToAttributes?.(document, copyParams) || copyParams || {};
      },
      (document) => {
        if ('mapDocumentToCopyResultViewModel' in this.options) {
          return (this.options as unknown as IWithCopyResultViewModelOptions<
            Configuration,
            Document
          >).mapDocumentToCopyResultViewModel(document);
        }

        const copyAttributeKey = this.options.copyAttributeKey || '_id' as keyof Document;

        return (document[copyAttributeKey]?.toString() || '') as GetCopyResultViewModel<Configuration>;
      },
      sessionId,
    );
  }

  protected async runFindManyWithConfiguration<CustomDocument, CustomViewModel>(
    params: GetFindParams<Configuration> & IPaginationParams<GetSortField<Configuration>>,
    mapper: (document: CustomDocument) => Promise<CustomViewModel> | CustomViewModel,
    populationOptions?: mongoose.PopulateOptions | Array<mongoose.PopulateOptions>,
    projection?: mongoose.ProjectionFields<Document>,
    sessionId?: string,
  ): Promise<CustomViewModel[]> {
    const documents = await this.options.model.find(this.getFindQuery(params), projection, {
      skip: params.offset,
      limit: params.count,
      readPreference: this.options.readOptions?.findMany,
    }).sort(this.getFindSortParams(params))
      .populate(populationOptions || [])
      .session(this.transactionManager.findById(sessionId) || null)
      .lean() as Array<CustomDocument>;

    return Promise.all(documents.map((document) => {
      return Promise.resolve(mapper(document));
    }));
  }

  protected async runFindOneWithConfiguration<CustomDocument, CustomViewModel>(
    params: GetFindParams<Configuration>,
    mapper: (document: CustomDocument) => Promise<CustomViewModel> | CustomViewModel,
    populationOptions?: mongoose.PopulateOptions | Array<mongoose.PopulateOptions>,
    projection?: mongoose.ProjectionFields<Document>,
    sessionId?: string,
  ): Promise<CustomViewModel | null> {
    const document = await this.options.model.findOne(this.getFindQuery(params), projection, {
      readPreference: this.options.readOptions?.findOne,
    })
      .populate(populationOptions || [])
      .session(this.transactionManager.findById(sessionId) || null)
      .allowDiskUse(!!this.options.diskUsageConfiguration?.findMany)
      .lean() as CustomDocument | null;

    return document && Promise.resolve(mapper(document));
  }

  protected async runCreateOneWithConfiguration<CustomDocument, CustomViewModel>(
    params: GetCreateParams<Configuration>,
    mapper: (document: CustomDocument) => Promise<CustomViewModel> | CustomViewModel,
    populationOptions?: mongoose.PopulateOptions | Array<mongoose.PopulateOptions>,
    sessionId?: string,
  ): Promise<CustomViewModel> {
    const createModelParamsPromise = Promise.resolve(this.options.transformCreateParamsToModel?.(params) || params);

    const [document] = await this.options.model.create([await createModelParamsPromise], {
      lean: true,
      session: this.transactionManager.findById(sessionId),
    });

    const populatedDocument = await document.populate(populationOptions || []);

    return Promise.resolve(mapper(populatedDocument.toObject({ virtuals: true }) as CustomDocument));
  }

  protected async runCreateManyWithConfiguration<CustomDocument, CustomViewModel>(
    params: GetCreateParams<Configuration>[],
    mapper: (document: CustomDocument) => Promise<CustomViewModel> | CustomViewModel,
    sessionId?: string,
  ): Promise<CustomViewModel[]> {
    const createModelParamsPromise = await Promise.all(params.map((param) => Promise.resolve(this.options.transformCreateParamsToModel?.(param) || param)));

    const documents = await this.options.model.create([...createModelParamsPromise], {
      lean: true,
      session: this.transactionManager.findById(sessionId),
    });

    return Promise.all(documents.map((document) => {
      return mapper(document.toObject({ virtuals: true }));
    }));
  }

  protected async runUpdateOneWithConfiguration<CustomDocument, CustomViewModel>(
    findParams: GetFindParams<Configuration>,
    params: GetUpdateParams<Configuration>,
    mapper: (document: CustomDocument) => Promise<CustomViewModel> | CustomViewModel,
    populationOptions?: mongoose.PopulateOptions | Array<mongoose.PopulateOptions>,
    projection?: mongoose.ProjectionFields<Document>,
    options?: IUpdateOneOptions,
  ): Promise<CustomViewModel | null> {
    const model = this.options.getModelTypeFromUpdateParams?.(params) || this.options.model;
    const updateQueryPromise = Promise.resolve(this.options.transformUpdateParamsToQuery?.(params) || params);

    const document = await model.findOneAndUpdate(
      this.getFindQuery(findParams),
      (await updateQueryPromise) as mongoose.UpdateQuery<Document>,
      {
        session: this.transactionManager.findById(options?.sessionId),
        lean: true, projection,
        new: !options?.returnPrevious,
      },
    ).populate(populationOptions || []);

    return document && Promise.resolve(mapper(document as CustomDocument));
  }

  protected async runCopyManyWithConfiguration<CopyViewModel>(
    findParams: GetFindParams<Configuration> & IPaginationLimitParams,
    duplicateAttributes: (document: Document) => Promise<AnyKeys<Document>>,
    mapper: (document: Document) => CopyViewModel,
    sessionId?: string,
  ): Promise<ICopyResult<CopyViewModel>> {
    const documents = await this.options.model.find(this.getFindQuery(findParams), undefined, {
      skip: findParams.offset,
      limit: findParams.count,
    }).lean()
      .sort(this.options.defaultCopySortQuery || { _id: 1 })
      .session(this.transactionManager.findById(sessionId) || null) as Array<Document>;

    const documentsCopies = await Promise.all(documents.map(async (document) => {
      const documentCopy = swallowCopy(document as Record<string, unknown>) as Partial<Document>;

      const copiedAttributesPromise = Promise.resolve(duplicateAttributes(document));

      const attributes = await copiedAttributesPromise;

      Object.keys(attributes).forEach((key) => {
        (documentCopy as Record<string, unknown>)[key] = (attributes as Record<string, unknown>)[key];
      });

      delete documentCopy._id;

      return documentCopy;
    }));

    const copiedDocuments = await this.options.model.insertMany(documentsCopies, {
      session: this.transactionManager.findById(sessionId),
      lean: true,
    });

    return documents.map((document, index) => {
      return {
        document: mapper(document),
        documentCopy: mapper(copiedDocuments[index] as Document),
      };
    }, {});
  }

  protected abstract getFindQuery(params: GetFindParams<Configuration>): mongoose.FilterQuery<Document>;
  protected abstract mapToDefaultViewModel(
    document: PopulatedDocument,
  ): GetViewModel<Configuration> | Promise<GetViewModel<Configuration>>;

  protected getDefaultModel() {
    return this.options.model;
  }

  protected getFindSortParams(params: IPaginationParams<GetSortField<Configuration>>): { [key: string]: SortOrder } | undefined {
    if (!params.sortField || !params.sortDirection) {
      return undefined;
    }

    return {
      [params.sortField]: params.sortDirection === SortDirection.Asc ? 1 : -1,
    };
  }
}
