const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;

    // Remove realtime subscriptions
    content = content.replace(/const subscription = supabase[\s\S]*?\.subscribe\(\);/g, `
    // Removed Supabase subscription
    const subscription = { unsubscribe: () => {} };
    // Polling fallback
    const pollInterval = setInterval(() => {
      fetchData && fetchData();
      fetchWithdrawals && fetchWithdrawals();
    }, 10000);
    `);
    content = content.replace(/subscription\.unsubscribe\(\);/g, `subscription.unsubscribe();
      clearInterval(pollInterval);`);

    // Edge Functions
    content = content.replace(/`${import.meta.env.VITE_SUPABASE_URL}\/functions\/v1\/create-company-user`/g, "'' /* replaced by api */");
    content = content.replace(/`${import.meta.env.VITE_SUPABASE_URL}\/functions\/v1\/delete-company-user`/g, "'' /* replaced by api */");

    // Generic .from() -> API mappings
    // 1. BulkTaskImport.tsx / TaskForm.tsx
    content = content.replace(/const \{ data, error \} = await supabase[\s\S]*?\.from\('companies'\)[\s\S]*?\.order\('name'\);/g, "const data = await api.get('/companies'); const error = null;");
    content = content.replace(/const \{ data: createdTask, error: taskError \} = await supabase[\s\S]*?\.from\('tasks'\)[\s\S]*?\.insert\(\[taskData\]\)[\s\S]*?\.single\(\);/g, "const createdTask = await api.post('/tasks', taskData); const taskError = null;");

    // 2. CompanyDashboard.tsx
    content = content.replace(/const \{ data: companyUserData, error \} = await supabase[\s\S]*?\.from\('company_users'\)[\s\S]*?\.single\(\);/g, "const companyUserData = await api.get('/company-users/me'); const error = null;");
    content = content.replace(/const \{ data: tasks, error: tasksError \} = await supabase[\s\S]*?\.from\('tasks'\)[\s\S]*?\.eq\('company_id', companyUser\.companyId\);/g, "const tasks = await api.get('/tasks?companyId=' + companyUser.companyId); const tasksError = null;");
    content = content.replace(/const \{ data: allSubmissions, error: allSubmissionsError \} = await supabase[\s\S]*?\.from\('task_submissions'\)[\s\S]*?\.in\('task_id', taskIds\);/g, "const allSubmissions = await api.get('/submissions?companyId=' + companyUser.companyId); const allSubmissionsError = null;");

    // 3. UserDashboard.tsx
    content = content.replace(/const \{ data, error \} = await supabase[\s\S]*?\.from\('profiles'\)[\s\S]*?\.single\(\);/g, "const { user: data } = await api.get('/auth/me'); const error = null;");
    content = content.replace(/const \{ data: activeCompanies, error: companiesError \} = await supabase[\s\S]*?\.from\('companies'\)[\s\S]*?\.eq\('active', true\);/g, "const activeCompanies = await api.get('/companies'); const companiesError = null;");
    content = content.replace(/const \{ data, error \} = await supabase[\s\S]*?\.from\('task_submissions'\)[\s\S]*?\.eq\('user_id', userProfile\.id\);/g, "const data = await api.get('/submissions'); const error = null;");

    // 4. WithdrawalForm.tsx
    content = content.replace(/const \{ error: withdrawalError \} = await supabase[\s\S]*?\.from\('withdrawals'\)[\s\S]*?\.insert\(\[\{([^}]+)\}\]\);/g, "await api.post('/withdrawals', {$1}); const withdrawalError = null;");
    content = content.replace(/const \{ error: balanceError \} = await supabase[\s\S]*?\.from\('profiles'\)[\s\S]*?\.update\(\{([^}]+)\}\)[\s\S]*?\.eq\('id', userProfile\.id\);/g, "const balanceError = null; /* handled by backend */");

    // 5. TaskSubmissionForm.tsx
    content = content.replace(/const \{ error \} = await supabase[\s\S]*?\.from\('task_submissions'\)[\s\S]*?\.update\(([^)]+)\)[\s\S]*?\.eq\('id', existingSubmission\.id\);/g, "await api.put(`/submissions/${existingSubmission.id}`, $1); const error = null;");
    content = content.replace(/const \{ error \} = await supabase[\s\S]*?\.from\('task_submissions'\)[\s\S]*?\.insert\(\[([^\]]+)\]\);/g, "await api.post('/submissions', $1); const error = null;");

    // 6. CompanyTaskSection.tsx
    content = content.replace(/const \{ data: userProfile, error: profileError \} = await supabase[\s\S]*?\.from\('profiles'\)[\s\S]*?\.single\(\);/g, "const { user: userProfile } = await api.get('/auth/me'); const profileError = null;");
    content = content.replace(/const \{ data: companyTasks, error: tasksError \} = await supabase[\s\S]*?\.from\('tasks'\)[\s\S]*?\.eq\('company_id', company\.id\)[\s\S]*?\.eq\('active', true\);/g, "const companyTasks = await api.get('/tasks?companyId=' + (company._id || company.id)); const tasksError = null;");
    content = content.replace(/const \{ data: userSubmissions, error: submissionsError \} = await supabase[\s\S]*?\.from\('task_submissions'\)[\s\S]*?\.eq\('user_id', userProfile\.id\);/g, "const userSubmissions = await api.get('/submissions'); const submissionsError = null;");

    // 7. CompanyLoginPage.tsx
    content = content.replace(/const \{ data: companyUser, error: companyUserError \} = await supabase[\s\S]*?\.from\('company_users'\)[\s\S]*?\.single\(\);/g, "const companyUser = await api.get('/auth/me').then(res => res.user); const companyUserError = null;");

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log('Processed', filePath);
    }
}

function walk(dir) {
    fs.readdirSync(dir).forEach(file => {
        let fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            processFile(fullPath);
        }
    });
}

walk('F:/Teen-Pay/src');
