

| \# | Check | Yes / No / N/A | Evidence |
| ----- | ----- | ----- | ----- |
| 1 | .env is gitignored and is not in the repository | Yes | Upon running git ls-files .env, no response resulted. |
| 2 | A env.example with placeholder values only is committed | Yes | Reviewable at .env.example, no Supabase credentials were inputted. |
| 3 | No connection string, key, token or password is hardcoded in source, comments or commented-out code | Yes | Reviewable in SupabaseClient.js, aforementioned details are not hardcoded. |
| 4 | Git history is clean: I searched git log \-p for password, secret, api key and postgress:// | Yes | No result after running “git ls-files node\_modules” |
| 5 | Any credential that was ever committed has been rotated | N/A | No credentials committed, as seen above this number. |
| 6 | Production credentials live only in my hosting provider’s environment settings | N/A | Undeployed yet, the app currently runs on “npm start” |

| \# | Check | Yes / No / N/A | Evidence |
| ----- | ----- | ----- | ----- |
| 7 | No secret value is written literally in any workflow YAML file | No | No workflows exist. |
| 8 | Secrets are stored in repository Actions secrets and read with \${{ secrets.NAME }} | No |  |
| 9 | No workflow step echoes, dumps or debug-prints a secret, and I opened a recent run’s log to confirm | No |  |
| 10 | Uploaded build artifacts contain no .env, key file or generated config | No |  |
| 11 | Third-party actions are pinned to a commit SHA, not a moveable tag | No |  |
| 12 | Secret scanning and push protection are enabled on the repository | No |  |

| \# | Check | Yes / No / N/A | Evidence |
| ----- | ----- | ----- | ----- |
| 13 | Every query taking user input uses parameters, never string concatenation | Yes | Database access only goes through the JS client query. |
| 14 | The database is not open to the whole internet, or is reachable only by the app | Yes | Only the app connects to it. Additionally, it is locked by a Database password. |
| 15 | The database user the app connects as has only the permissions it needs | Yes | The app only utilizes an anon key from my Supabase, which is governed by my policies. |
| 16 | Seed and sample data is invented, not real people’s data | Yes | mockData.js has recipes instead of sample account data. |
| 17 | Debug, seed and reset routes are removed before going public | Yes | Removed the console.log debug lines in supabaseClient.js. |

| \# | Check | Yes / No / N/A | Evidence |
| ----- | ----- | ----- | ----- |
| 18 | The app has an access layer: Cloudfare Zero Trust, an app-level password, or a real login | Yes | Using Supabase.Auth, a simple, real login is enabled, located at the app’s Login page. |
| 19 | If Supabase or Firebase: Row Level Security or security rules are on, and I tested it signed out | Yes (Supabase) | Reviewable and visible on Supabase. |
| 20 | If Zero Trust: \[email\] is on the access policy… | N/A | Used Supabase. |
| 21 | The gate covers every route, including the ones that only change data | N/A | Supabase Auth login used. |
| 22 | The credentials for the gate are environment variables, not in source | N/A | Supabase Auth login used. |

| \# | Check | Yes / No / N/A | Evidence |
| ----- | ----- | ----- | ----- |
| 23 | Input from the user is validated on the server, not only in the browser | No | There is a step validation in RecipeEditorPage.jsx, however, there’s no NOT NULL or check constraint in the db itself. |
| 24 | User-supplied text is escaped when rendered, so it cannot inject markup or script | No | All inputs are rendered as plain JSX text. |
| 25 | Error responses do not expose stack traces, file paths or connection details | No | The Recipe Editor Page does not have a try/catch on its Save handler. Therefore, a failed Supabase call would only leave the user’s draft in “Saving…,” showing nothing to the user. |
| 26 | CORS is not a wildcard on routes that change data | N/A | No custom APIs created, the browser directly talks to Supabase. |

| \# | Check | Yes / No / N/A | Evidence |
| ----- | ----- | ----- | ----- |
| 27 | No student number, personal email, phone number or home address in the repository or in commit messages | Yes | The app only concerns itself with recipes. The only data that could actually constitute a concern would be the username and password. But even those are the kind of data that does not necessitate a user to accomplish with their real, personal details.  |
| 28 | No classmate's personal data in the repository | Yes | The only testing account the app currently has is named testacc, and multiple account testing is planned to only add numbering next to the starter account (testacc1, testacc2), not any real person’s data—especially, a classmate. |
| 29 | Dependencies come from official registries, and node\_modules is gitignored | Yes | As dependencies are all standard public npm packages (package.json, and node\_modules is gitignore). (check again) |
| 30 | Images, fonts and other assets are mine, licensed, or credited | Yes | Fonts (Lexend and Poppins) were GFonts, openly licensed for free use. As for the Logo (an image), made by Canva’s free elements.  |
| 31 | Repository visibility is deliberate, and I checked it after my last push | Yes |  Deliberately public for checking. |

