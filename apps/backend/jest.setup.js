jest.mock('typeorm-transactional', () => ({
  addTransactionalDataSource: (value) => value,
  initializeTransactionalContext: () => {},
  Transactional: () => () => ({}),
}));
