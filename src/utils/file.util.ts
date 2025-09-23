import fs from 'fs'
import path from 'path'
import stream from 'stream'

import { Effect } from 'effect'

import { FileHandler } from '@src/handlers'
import { logger } from './logger.util'

/**
 * A utility function to check the accessibility of a given file/directory by verifying if it exists
 * and if the current process has read and write permissions.
 *
 * @param file - The file/directory path to check. Must be a valid path string.
 *
 * @returns An `Effect` that yields the directory path if the file exists and is accessible.
 *
 * @throws AccessError - If there is an issue with accessing the file, such as lack of permissions or non-existence of the directory.
 *
 * @example
 * const checkDirectory = checkFile('/path/to/dir');
 *
 * checkDirectory.pipe(Effect.runPromise).then((dir) => {
 *   console.log(`Directory is accessible: ${dir}`); // '/path/to/dir'
 * }).catch((error) => {
 *   console.error(error); // Handles AccessError
 * });
 *
 * @example
 * // Handling errors explicitly:
 * checkDirectory.pipe(
 *   Effect.catchAll((error) => Effect.succeed(`Error occurred: ${error.message}`)),
 *   Effect.runPromise
 * ).then(console.log);
 */
export const checkFile = (file: string) =>
	Effect.gen(function* () {
		logger.debug(`Checking file ${file}`)

		yield* Effect.tryPromise({
			try: () =>
				new Promise((resolve, reject) => {
					fs.access(
						file,
						fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK, // Ensure read/write permissions
						error => {
							if (error) {
								return reject(error)
							}

							resolve(file)
						}
					)
				}),
			catch: error => new FileHandler.AccessError(error, file, 'ACCESS'),
		})

		return file
	}).pipe(
		Effect.catchAll(error => {
			logger.debug(`${error.title}, ${error.message}`)
			return error
		})
	)

/**
 * A utility function to create a directory at a specified path, ensuring that all intermediate directories
 * are also created if they do not exist.
 *
 * @param dir - The directory path to create. Must be a valid directory path string.
 *
 * @returns An `Effect` that yields the directory path if the directory was successfully created.
 *
 * @throws AccessError - If there is an issue with creating the directory, such as lack of permissions or other file system errors.
 *
 * @example
 * const createDirectory = makeDir('/path/to/dir');
 *
 * createDirectory.pipe(Effect.runPromise).then((dir) => {
 *   console.log(`Directory created: ${dir}`); // '/path/to/dir'
 * }).catch((error) => {
 *   console.error(error); // Handles AccessError
 * });
 *
 * @example
 * // Handling errors explicitly:
 * createDirectory.pipe(
 *   Effect.catchAll((error) => Effect.succeed(`Error occurred: ${error.message}`)),
 *   Effect.runPromise
 * ).then(console.log);
 */
export const makeDir = (dir: string) =>
	Effect.gen(function* () {
		logger.debug(`Making dir ${dir}`)

		yield* Effect.tryPromise({
			try: () =>
				new Promise((resolve, reject) => {
					fs.mkdir(dir, { recursive: true }, error => {
						if (error) {
							return reject(error)
						}

						resolve(dir)
					})
				}),
			catch: error => new FileHandler.AccessError(error, dir, 'MKDIR'),
		})

		logger.debug(`Writted ${dir}`)
		return dir
	}).pipe(
		Effect.catchAll(error => {
			logger.debug(`${error.title}, ${error.message}`)
			return error
		})
	)

export const stat = (f: string) =>
	checkFile(f).pipe(
		Effect.flatMap(file =>
			Effect.tryPromise({
				try: () =>
					new Promise<{ file: string; stats: fs.Stats }>((resolve, reject) =>
						fs.stat(file, (error, stats) => {
							if (error) return reject(error)
							resolve({ file, stats })
						})
					),
				catch: error => new FileHandler.AccessError(error, file, 'ACCESS'),
			})
		)
	)
