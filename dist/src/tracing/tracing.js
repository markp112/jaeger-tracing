"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeTracing = void 0;
const resources_1 = require("@opentelemetry/resources");
const semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
const sdk_trace_base_1 = require("@opentelemetry/sdk-trace-base");
const sdk_trace_node_1 = require("@opentelemetry/sdk-trace-node");
const api_1 = require("@opentelemetry/api");
const exporter_jaeger_1 = require("@opentelemetry/exporter-jaeger");
const instrumentation_1 = require("@opentelemetry/instrumentation");
const instrumentation_2 = require("@prisma/instrumentation");
const instrumentation_express_1 = require("@opentelemetry/instrumentation-express");
const instrumentation_http_1 = require("@opentelemetry/instrumentation-http");
api_1.diag.setLogger(new api_1.DiagConsoleLogger(), api_1.DiagLogLevel.DEBUG);
function initializeTracing(serviceName, environment) {
    var _a;
    const traceRatio = process.env.NODE_ENV === 'production' ? 0.1 : 1.0;
    const endpoint = (_a = process.env.JAEGER_END_POINT) !== null && _a !== void 0 ? _a : 'http://jaeger-all-in-one-inmemory-collector.jaeger-test.svc:14268/api/traces';
    const jaegerExporter = new exporter_jaeger_1.JaegerExporter({ endpoint });
    const provider = new sdk_trace_node_1.NodeTracerProvider({
        sampler: new sdk_trace_base_1.TraceIdRatioBasedSampler(traceRatio),
        resource: new resources_1.Resource({
            [semantic_conventions_1.SemanticResourceAttributes.SERVICE_NAME]: serviceName,
            [semantic_conventions_1.SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: environment,
        }),
    });
    if (process.env.NODE_ENV === 'production') {
        provider.addSpanProcessor(new sdk_trace_base_1.BatchSpanProcessor(jaegerExporter));
    }
    else {
        provider.addSpanProcessor(new sdk_trace_base_1.SimpleSpanProcessor(jaegerExporter));
    }
    (0, instrumentation_1.registerInstrumentations)({
        instrumentations: [
            new instrumentation_http_1.HttpInstrumentation(),
            new instrumentation_express_1.ExpressInstrumentation(),
            new instrumentation_2.PrismaInstrumentation(),
        ],
        tracerProvider: provider,
    });
    provider.register();
    return api_1.trace.getTracer(serviceName);
    // return provider.getTracer(serviceName);
}
exports.initializeTracing = initializeTracing;
//# sourceMappingURL=tracing.js.map