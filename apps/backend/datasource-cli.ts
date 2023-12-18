import { DataSource } from 'typeorm';
import config from './datasource';

export default new DataSource(config);
