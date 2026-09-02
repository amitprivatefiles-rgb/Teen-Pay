const fs = require('fs');

let dash = fs.readFileSync('src/components/company/CompanyDashboard.tsx', 'utf-8');
dash = dash.replace(/await supabase\.auth\.signOut\(\);/g, 'signOut();');
fs.writeFileSync('src/components/company/CompanyDashboard.tsx', dash);

let login = fs.readFileSync('src/components/company/CompanyLoginPage.tsx', 'utf-8');
login = login.replace(/const \{ data: authData, error: authError \} = await supabase\.auth\.signInWithPassword\([\s\S]*?\);/, `const authData = await api.post('/auth/company-login', { email, password });
      api.setToken(authData.token);
      const authError = null; // shim`);
login = login.replace(/await supabase\.auth\.signOut\(\);/g, '');
fs.writeFileSync('src/components/company/CompanyLoginPage.tsx', login);

let prog = fs.readFileSync('src/components/company/CompanyTaskProgress.tsx', 'utf-8');
prog = prog.replace(/await supabase\.from\('profiles'\)\.update\(\{[\s\S]*?\}\);/g, '');
prog = prog.replace(/await supabase\.from\('guest_task_submissions'\)\.update\(\{[\s\S]*?\}\);/g, 'await api.put(`/guest-submissions/${submission.id}`, { status: "approved" });');
fs.writeFileSync('src/components/company/CompanyTaskProgress.tsx', prog);
