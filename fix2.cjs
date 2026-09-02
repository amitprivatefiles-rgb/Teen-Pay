const fs = require('fs');
let content = fs.readFileSync('src/components/company/CompanyTaskProgress.tsx', 'utf-8');

// fetch submissions
content = content.replace(/const \{ data: guestData, error: guestError \} = await supabase[\s\S]*?if \(guestError\) throw guestError;/g, `const guestData = await api.get('/guest-submissions?companyId=' + companyUser.companyId);`);
content = content.replace(/let query = supabase[\s\S]*?const \{ data, error \} = await query;/g, `const data = await api.get('/submissions?companyId=' + companyUser.companyId);`);
content = content.replace(/if \(error\) throw error;/g, '');

// handleApprove (task)
content = content.replace(/const \{ error \} = await supabase[\s\S]*?\.eq\('id', submissionId\);/g, `await api.put(\`/submissions/\${submissionId}\`, { status: 'approved' });`);

// guest approve inline
content = content.replace(/const \{ error \} = await supabase[\s\S]*?\.eq\('id', submission\.id\);[\s\S]*?if \(error\) throw error;[\s\S]*?\/\/ Check if user account exists[\s\S]*?const \{ data: profile \} = await supabase[\s\S]*?\.single\(\);[\s\S]*?if \(profile\) \{[\s\S]*?await supabase\.from\('profiles'\)\.update\(\{[\s\S]*?\}\)\.eq\('id', profile\.id\);[\s\S]*?await supabase\.from\('guest_task_submissions'\)\.update\(\{[\s\S]*?\}\)\.eq\('id', submission\.id\);[\s\S]*?\}/g, `await api.put(\`/guest-submissions/\${submission.id}\`, { status: 'approved' });`);

// guest reject inline
content = content.replace(/const \{ error \} = await supabase[\s\S]*?\.eq\('id', submission\.id\);[\s\S]*?if \(error\) throw error;/g, `await api.put(\`/guest-submissions/\${submission.id}\`, { status: 'rejected', adminNotes: notes });`);

fs.writeFileSync('src/components/company/CompanyTaskProgress.tsx', content);
