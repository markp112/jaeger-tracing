module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: ['**/tests/**/*.(test|spec).ts'],
  moduleNameMapper: {
		"@api/(.*)": ["<rootDir>/src/api/$1"],
		"@logger/(.*)": ["<rootDir>/src/logger/$1"],
		"@core/(.*)": ["<rootDir>/src/core/$1"],
    "@repository/(.*)": ["<rootDir>/src/core/repository/$1"],
    "@model/(.*)": ["<rootDir>/src/core/model/$1"],
	},

	setupFilesAfterEnv: ["./jest.setup.js"],
  

};
