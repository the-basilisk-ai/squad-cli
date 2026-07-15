# Changelog

## [0.4.1](https://github.com/the-basilisk-ai/squad-cli/compare/cli-v0.4.0...cli-v0.4.1) (2026-07-15)


### Bug Fixes

* **auth:** support login and workspace listing for multi-org users ([#61](https://github.com/the-basilisk-ai/squad-cli/issues/61)) ([f1fb748](https://github.com/the-basilisk-ai/squad-cli/commit/f1fb74856ae079a55e6de1da2c9a0c6c98d7cd38))

## [0.4.0](https://github.com/the-basilisk-ai/squad-cli/compare/cli-v0.3.4...cli-v0.4.0) (2026-07-14)


### ⚠ BREAKING CHANGES

* This release targets the new Squad platform (v2) and is not compatible with the legacy Squad v1 platform. All endpoints and authentication now point at the v2 API and its PropelAuth project. The OST commands opportunity, solution and view are removed; feedback is replaced by signal and knowledge by document. If your workspace is still on Squad v1, remain on the previous CLI release (install @squadai/cli@0.3.x).

### Features

* rebuild CLI on the new Squad platform (v2) ([#59](https://github.com/the-basilisk-ai/squad-cli/issues/59)) ([3d4db3f](https://github.com/the-basilisk-ai/squad-cli/commit/3d4db3f4a5d32e593812d16476ebd1eb24d17fe5))


### Bug Fixes

* **cli:** report version from package.json ([#58](https://github.com/the-basilisk-ai/squad-cli/issues/58)) ([0d889ec](https://github.com/the-basilisk-ai/squad-cli/commit/0d889ec4b148cf56e11dcf6abd342e9d8129a2b2))

## [0.3.4](https://github.com/the-basilisk-ai/squad-cli/compare/cli-v0.3.3...cli-v0.3.4) (2026-07-13)


### Bug Fixes

* **config:** point API and auth URLs at v1 subdomain ([#56](https://github.com/the-basilisk-ai/squad-cli/issues/56)) ([307afe3](https://github.com/the-basilisk-ai/squad-cli/commit/307afe3ee470736bf2b883f02baf3c40b59de860))

## [0.3.3](https://github.com/the-basilisk-ai/squad-cli/compare/cli-v0.3.2...cli-v0.3.3) (2026-06-15)


### Bug Fixes

* **deps:** remediate Dependabot security advisories ([#48](https://github.com/the-basilisk-ai/squad-cli/issues/48)) ([4dda020](https://github.com/the-basilisk-ai/squad-cli/commit/4dda0200304c3125284d183a3c1548d267936b7c))

## [0.3.2](https://github.com/the-basilisk-ai/squad-cli/compare/cli-v0.3.1...cli-v0.3.2) (2026-05-11)


### Bug Fixes

* bump axios resolution to 1.16.0 to address Dependabot alerts ([#38](https://github.com/the-basilisk-ai/squad-cli/issues/38)) ([189afd0](https://github.com/the-basilisk-ai/squad-cli/commit/189afd0cbbc4b043ca30c29f98c49de0de21d6de))

## [0.3.1](https://github.com/the-basilisk-ai/squad-cli/compare/cli-v0.3.0...cli-v0.3.1) (2026-05-07)


### Bug Fixes

* **ci:** use claude_code_oauth_token instead of anthropic_api_key ([#16](https://github.com/the-basilisk-ai/squad-cli/issues/16)) ([841c1d0](https://github.com/the-basilisk-ai/squad-cli/commit/841c1d0511cb8a71b0bf3ef0a10e02829905149d))
* resolve Dependabot security vulnerabilities ([#19](https://github.com/the-basilisk-ai/squad-cli/issues/19)) ([a7d390d](https://github.com/the-basilisk-ai/squad-cli/commit/a7d390de2f531f2d5868b0d50921978ea5e80aae))

## [0.3.0](https://github.com/the-basilisk-ai/squad-cli/compare/cli-v0.2.0...cli-v0.3.0) (2026-03-18)


### Features

* add createdAt/updatedAt to list outputs ([#14](https://github.com/the-basilisk-ai/squad-cli/issues/14)) ([5944df0](https://github.com/the-basilisk-ai/squad-cli/commit/5944df0e30b13125ba0386f0e3c01ecbf4fc7765))


### Bug Fixes

* clean up unused --verbose flag and simplify workspace summary output ([#12](https://github.com/the-basilisk-ai/squad-cli/issues/12)) ([136c8b5](https://github.com/the-basilisk-ai/squad-cli/commit/136c8b54e80dad632a475f1c934011f14f0722c9))

## [0.2.0](https://github.com/the-basilisk-ai/squad-cli/compare/cli-v0.1.0...cli-v0.2.0) (2026-03-18)


### Features

* add release-please for automated releases ([#6](https://github.com/the-basilisk-ai/squad-cli/issues/6)) ([268520f](https://github.com/the-basilisk-ai/squad-cli/commit/268520fe692dfa20a22a0c6257e47e57530a07be))
* bootstrap Squad CLI with OAuth2 PKCE auth and full command set ([#1](https://github.com/the-basilisk-ai/squad-cli/issues/1)) ([f02b988](https://github.com/the-basilisk-ai/squad-cli/commit/f02b9886f7180a9ebc19cd5ab88da339f2c0e975))


### Bug Fixes

* correct API request handling and add smoke tests ([#3](https://github.com/the-basilisk-ai/squad-cli/issues/3)) ([071de4d](https://github.com/the-basilisk-ai/squad-cli/commit/071de4d2f17a21c63d2570448fc155e12f73c78b))
