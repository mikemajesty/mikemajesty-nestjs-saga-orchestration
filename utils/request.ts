export interface ApiRequest {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly body: any;
  readonly params: { [key: string]: string | number };
  readonly query: { [key: string]: string | number };
  readonly headers: Headers & { authorization: string };
  readonly url: string;
  readonly files: {
    buffer: Buffer;
    encoding: string;
    fieldname: string;
    mimetype: string;
    originalname: string;
    size: number;
  }[];
}
