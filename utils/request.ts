import { AttributeValue, Context, Span, SpanStatus, TimeInput } from "@opentelemetry/api";
import { Tracer } from "@opentelemetry/api";
import { AxiosInstance, AxiosRequestConfig } from "axios";

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

export type TracingType = {
  span: Span;
  tracer: Tracer;
  tracerId: string;
  axios: (config?: AxiosRequestConfig) => AxiosInstance;
  setStatus: (status: SpanStatus) => void;
  logEvent: (name: string, attributesOrStartTime?: AttributeValue | TimeInput) => void;
  addAttribute: (key: string, value: AttributeValue) => void;
  createSpan: (name: string, parent?: Context) => Span;
  finish: () => void;
};
