const pino = require("pino");
// const { TracerProvider, TraceFlags } = require('@opentelemetry/api');

jest.mock("./src/logger/logger", () => {
	const logger = pino({
		level: "silent",
	});
	
	return {
		__esModule: true,
		default: logger,
	};
});
