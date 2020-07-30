import { MimeType } from '../../src/database/enum';

export interface FileAttr {
  mime: MimeType;
  filepath: string;
  filename: string;
}

const fileAttrs: FileAttr[] = [
  {
    mime: MimeType.JPEG,
    filename: 'image.jpg',
    filepath: '\\upload\\image.jpg',
  },
  {
    mime: MimeType.DOCX,
    filename: 'document.docx',
    filepath: '\\upload\\document.docx',
  },
  {
    mime: MimeType.PDF,
    filename: 'pdf.pdf',
    filepath: '\\upload\\pdf.pdf',
  },
];

export { fileAttrs };
