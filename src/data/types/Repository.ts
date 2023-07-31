export interface IUpdateOneOptions {
  sessionId?: string;
  returnPrevious?: boolean;
  timestamps?: boolean;
}

export interface IUpdateManyOptions {
  sessionId?: string;
  timestamps?: boolean;
}

export type ICopyResult<ViewModel> = Array<{
  document: ViewModel;
  documentCopy: ViewModel;
}>;
