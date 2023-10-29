module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ["<rootDir>/src/tests/"],
  moduleDirectories: ["node_modules", "<rootDir>"],
  transform: {
		"^.+\\.ts?$": "ts-jest",
	},
  testMatch: ['**/tests/**/*.(test|spec).ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
		"@api/(.*)": ["<rootDir>/src/api/$1"],
		"@logger/(.*)": ["<rootDir>/src/logger/$1"],
		"@core/(.*)": ["<rootDir>/src/core/$1"],
    "@repository/(.*)": ["<rootDir>/src/core/repository/$1"],
    "@model/(.*)": ["<rootDir>/src/core/model/$1"],
	},

	setupFilesAfterEnv: ["./jest.setup.js"],
  

};
