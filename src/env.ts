import { log } from './logger'
import fs from 'fs'
import path from 'path'

const tokensPath = path.join('.', 'env', 'tokens.json')
const tokens = JSON.parse(fs.readFileSync(tokensPath).toString())
if (!tokens.clientUID.length || !tokens.clientSecret.length || !tokens.callbackURL.length) {
	console.error('Token file invalid, see tokens.example.json')
	process.exit(1)
}

const campusIDsPath = path.join('.', 'env', 'campusIDs.json')
const campusIDs: { [key: string]: number }[] = JSON.parse(fs.readFileSync(campusIDsPath).toString())

const projectIDsPath = path.join('.', 'env', 'projectIDs.json')
const projectIDs: { [key: string]: number }[] = JSON.parse(fs.readFileSync(projectIDsPath).toString())

export interface Campus {
	name: string
	id: number
	databasePath: string // path to the database subfolder for this campus
	projectUsersPath: string // users that are subscribed to a project
	lastPullPath: string // timestamp for when the server did a last pull
}

export interface Env {
	logLevel: 0 | 1 | 2 | 3
	pullTimeout: number
	projectIDs: { [key: string]: number }[]
	_42CursusID: number
	databaseRoot: string
	campuses: Campus[]
	sessionStorePath: string // session key data
	userDBpath: string // users associated with sessions
	scope: string[]
	authorizationURL: string
	tokenURL: string
	provider: string
	authPath: string
	callbackURL: string
	clientUID: string
	clientSecret: string
}

const databaseRoot: string = path.join('.', 'database')
let campuses: Campus[] = []
for (const campusName in campusIDs) {
	const campus: Campus = {
		name: campusName,
		id: campusIDs[campusName!],
		databasePath: path.join(databaseRoot, campusName),
		projectUsersPath: path.join(databaseRoot, campusName, 'projectUsers.json'),
		lastPullPath: path.join(databaseRoot, campusName, 'lastpull.txt'),
	}
	campuses.push(campus)
}

export const env: Env = {
	logLevel: 1, // 0 being no logging
	pullTimeout: 24 * 60 * 60 * 1000, // how often to pull the project users statuses form the intra api (in Ms)
	projectIDs,
	_42CursusID: 21,
	databaseRoot,
	campuses,
	sessionStorePath: path.join(databaseRoot, 'sessions'),
	authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
	tokenURL: 'https://api.intra.42.fr/oauth/token',
	userDBpath: path.join(databaseRoot, 'users.json'),
	provider: '42',
	authPath: '/auth/42', // TODO
	scope: ['public'],
	...tokens,
}

log(1, `Watching ${Object.keys(campusIDs).length} campuses`)
log(1, `Watching ${Object.keys(projectIDs).length} projects`)
