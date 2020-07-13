import { Readable } from 'stream';

// Type definitions for multer 1.4
// Project: https://github.com/expressjs/multer
// Definitions by: jt000 <https://github.com/jt000>
//                 vilicvane <https://github.com/vilic>
//                 David Broder-Rodgers <https://github.com/DavidBR-SW>
//                 Michael Ledin <https://github.com/mxl>
//                 HyunSeob Lee <https://github.com/hyunseob>
//                 Pierre Tchuente <https://github.com/PierreTchuente>
//                 Oliver Emery <https://github.com/thrymgjol>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.8

export interface MulterFile {
  /** Name of the form field associated with this file. */
  fieldname: string;
  /** Name of the file on the uploader's computer. */
  originalname: string;
  /**
   * Value of the `Content-Transfer-Encoding` header for this file.
   * @deprecated since July 2015
   * @see RFC 7578, Section 4.7
   */
  encoding: string;
  /** Value of the `Content-Type` header for this file. */
  mimetype: string;
  /** Size of the file in bytes. */
  size: number;
  /**
   * A readable stream of this file. Only available to the `_handleFile`
   * callback for custom `StorageEngine`s.
   */
  stream: Readable;
  /** `DiskStorage` only: Directory to which this file has been uploaded. */
  destination: string;
  /** `DiskStorage` only: Name of this file within `destination`. */
  filename: string;
  /** `DiskStorage` only: Full path to the uploaded file. */
  path: string;
  /** `MemoryStorage` only: A Buffer containing the entire file. */
  buffer: Buffer;
}
