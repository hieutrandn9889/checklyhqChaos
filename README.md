# testPlaywright

# để tạo .auth/storageState.json
comment all in playwright.config.ts and home.spec.ts
// export const STORAGE_STATE = path.join(__dirname, '.auth/storageState.json');
// storageState: STORAGE_STATE

# prompt test plan => planner agent
generate a test plan for login page and save as plan in e2e/agent folder

# or 
generate a test plan for login page and save as plan in .kilocode/workflows folder

# prompt generate test from test plan => generator agent
generate tests from test plan for section 2.
Invalid credentials (wrong password)

# prompt run and test => healer agent
run test and fix error   

========
# Prompt C2:
1. "generate a test plan for the movies list feature and save it as movies-test-plan in the specs folder"
2. "generate a test file for each point in the section 4. Add/Remove Movies from List from the test plan"
3. "run test and fix all failing tests"