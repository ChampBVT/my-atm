import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';

const moduleMocker = new ModuleMocker(global);

export const mocker = (token: unknown): unknown => {
  if (typeof token === 'function') {
    const mockMetadata = moduleMocker.getMetadata(
      token,
    ) as MockFunctionMetadata<any, any>;

    const Mock = moduleMocker.generateFromMetadata(mockMetadata);

    return new Mock();
  }
};
