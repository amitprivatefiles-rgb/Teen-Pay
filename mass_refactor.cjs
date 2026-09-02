const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;

    // Supabase Auth
    content = content.replace(/const\s+\{\s*data:\s*\{\s*user\s*\}\s*\}\s*=\s*await\s+supabase\.auth\.getUser\(\);/g, '');
    content = content.replace(/const\s+\{\s*data:\s*\{\s*session\s*\}\s*\}\s*=\s*await\s+supabase\.auth\.getSession\(\);/g, '');

    // .from('...').select(...)
    content = content.replace(/supabase\s*\.from\('tasks'\)\s*\.select\([^\)]+\)\s*\.eq\('id',\s*([^)]+)\)\s*\.single\(\)/g, "api.get(`/tasks/${$1}`)");
    content = content.replace(/supabase\s*\.from\('tasks'\)\s*\.insert\(\[([^\]]+)\]\)/g, "api.post('/tasks', $1)");
    content = content.replace(/supabase\s*\.from\('tasks'\)\s*\.update\(([^)]+)\)\s*\.eq\('id',\s*([^)]+)\)/g, "api.put(`/tasks/${$2}`, $1)");
    content = content.replace(/supabase\s*\.from\('tasks'\)\s*\.delete\(\)\s*\.eq\('id',\s*([^)]+)\)/g, "api.delete(`/tasks/${$1}`)");
    
    // .tasks -> .taskId
    content = content.replace(/\.tasks\?/g, '.taskId?');
    content = content.replace(/\.tasks\./g, '.taskId.');
    // .profiles -> .userId
    content = content.replace(/\.profiles\?/g, '.userId?');
    content = content.replace(/\.profiles\./g, '.userId.');
    // .companies -> .companyId
    content = content.replace(/\.companies\?/g, '.companyId?');
    content = content.replace(/\.companies\./g, '.companyId.');
    
    // Handle specific file components
    if (filePath.includes('TaskManagement.tsx')) {
        content = content.replace(/const \{ data, error \} = await supabase\s*\n\s*\.from\('tasks'\)\s*\n\s*\.select\([\s\S]*?\)\s*\n\s*\.order\([\s\S]*?\);/g, "const data = await api.get('/tasks');");
        content = content.replace(/const \{ error \} = await supabase\s*\n\s*\.from\('tasks'\)\s*\n\s*\.delete\(\)\s*\n\s*\.eq\('id',\s*taskId\);/g, "await api.delete(`/tasks/${taskId}`);");
        content = content.replace(/const \{ error \} = await supabase\s*\n\s*\.from\('tasks'\)\s*\n\s*\.update\(\{ active: newStatus \}\)\s*\n\s*\.eq\('id',\s*taskId\);/g, "await api.put(`/tasks/${taskId}`, { active: newStatus });");
    }

    if (filePath.includes('CompanyManagement.tsx')) {
        content = content.replace(/const \{ data, error \} = await supabase\s*\n\s*\.from\('companies'\)\s*\n\s*\.select\([\s\S]*?\)\s*\n\s*\.order\([\s\S]*?\);/g, "const data = await api.get('/companies');");
        content = content.replace(/const \{ error \} = await supabase\s*\n\s*\.from\('companies'\)\s*\n\s*\.delete\(\)\s*\n\s*\.eq\('id',\s*id\);/g, "await api.delete(`/companies/${id}`);");
        content = content.replace(/const \{ error \} = await supabase\s*\n\s*\.from\('companies'\)\s*\n\s*\.update\(([^)]+)\)\s*\n\s*\.eq\('id',\s*([^)]+)\);/g, "await api.put(`/companies/${$2}`, $1);");
        content = content.replace(/const \{ error \} = await supabase\s*\n\s*\.from\('companies'\)\s*\n\s*\.insert\(\[([^\]]+)\]\);/g, "await api.post('/companies', $1);");
    }
    
    if (filePath.includes('CompanyUserManagement.tsx')) {
        content = content.replace(/supabase\.from\('companies'\)\.select\('\*'\)\.order\('name'\)/g, "api.get('/companies')");
        content = content.replace(/supabase\s*\n\s*\.from\('company_users'\)\s*\n\s*\.select\(`[\s\S]*?`\)\s*\n\s*\.order\([\s\S]*?\)/g, "api.get('/company-users')");
    }
    
    if (filePath.includes('TaskForm.tsx')) {
        content = content.replace(/const \{ data, error \} = await supabase\s*\n\s*\.from\('companies'\)\s*\n\s*\.select\('id, name'\)\s*\n\s*\.order\('name'\);/g, "const data = await api.get('/companies');");
        content = content.replace(/const \{ data: createdTask, error: taskError \} = await supabase\s*\n\s*\.from\('tasks'\)\s*\n\s*\.insert\(\[taskData\]\)\s*\n\s*\.select\(\)\s*\n\s*\.single\(\);/g, "const createdTask = await api.post('/tasks', taskData);");
    }

    if (filePath.includes('BulkTaskImport.tsx')) {
        content = content.replace(/const \{ data, error \} = await supabase\s*\n\s*\.from\('companies'\)\s*\n\s*\.select\('id, name'\)\s*\n\s*\.order\('name'\);/g, "const data = await api.get('/companies');");
        content = content.replace(/const \{ data: createdTask, error: taskError \} = await supabase\s*\n\s*\.from\('tasks'\)\s*\n\s*\.insert\(\[taskData\]\)\s*\n\s*\.select\(\)\s*\n\s*\.single\(\);/g, "const createdTask = await api.post('/tasks', taskData);");
    }

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
