import * as Faker from 'faker';
import { AppFactory } from '../../core/app.factory';
import { FileEntity, UpdateEntity } from '../entity';
import { FileAttr } from '../../../test/file';

interface FileParam {
  updatePool: UpdateEntity[];
  fileAttrPool: FileAttr[];
}

export class FileFactory extends AppFactory<FileEntity, FileParam> {
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
