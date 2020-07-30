import * as Faker from 'faker';
import { Factory } from '../core';
import { FileEntity, UpdateEntity } from '../../../src/database/entity';
import { FileAttr } from '../../file';

interface FileParam {
  updatePool: UpdateEntity[];
  fileAttrPool: FileAttr[];
}

export class FileFactory extends Factory<FileEntity, FileParam> {
  protected get(params: FileParam): FileEntity {
    const { updatePool, fileAttrPool } = params;

    const file = new FileEntity();

    const update = Faker.random.arrayElement(updatePool);
    file.update = update;
    file.owner = update.task.staff;

    const fileAttr = Faker.random.arrayElement(fileAttrPool);
    file.mime = fileAttr.mime;
    file.filename = fileAttr.filename;
    file.filepath = fileAttr.filepath;

    return file;
  }
}
