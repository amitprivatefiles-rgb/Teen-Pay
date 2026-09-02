const fs = require('fs');
const glob = require('glob');

const mapping = {
    'company_id': 'companyId',
    'task_type': 'taskType',
    'task_link': 'taskLink',
    'google_profile_link': 'googleProfileLink',
    'review_text': 'reviewText',
    'star_rating': 'starRating',
    'reward_amount': 'rewardAmount',
    'max_users': 'maxUsers',
    'screenshot_url': 'screenshotUrl',
    'total_earnings': 'totalEarnings',
    'daily_earnings': 'dailyEarnings',
    'admin_notes': 'adminNotes',
    'submitted_at': 'submittedAt',
    'reviewed_at': 'reviewedAt',
    'reviewed_by': 'reviewedBy',
    'created_at': 'createdAt',
    'updated_at': 'updatedAt',
    'user_id': 'userId',
    'task_id': 'taskId',
    'guest_email': 'guestEmail',
    'logo_url': 'logoUrl',
    'upi_id': 'upiId',
    'auth_user_id': 'authUserId',
    'credited_to_user_id': 'creditedToUserId',
    'credited_at': 'creditedAt',
    'processed_at': 'processedAt',
    'verification_deadline': 'verificationDeadline',
    'estimated_approval_date': 'estimatedApprovalDate',
    'suspension_reason': 'suspensionReason',
    'suspended_at': 'suspendedAt',
    'suspended_by': 'suspendedBy',
};

function processFile(filepath) {
    const originalContent = fs.readFileSync(filepath, 'utf-8');
    let content = originalContent;

    // Imports
    content = content.replace(/import \{ supabase \} from '..\/..\/lib\/supabase';/g, "import { api } from '../../lib/api';");
    content = content.replace(/import \{ supabase \} from '..\/lib\/supabase';/g, "import { api } from '../lib/api';");
    content = content.replace(/import \{ supabase \} from '..\/..\/..\/lib\/supabase';/g, "import { api } from '../../../lib/api';");
    content = content.replace(/import \{ supabase \} from '\.\/lib\/supabase';/g, "import { api } from './lib/api';");
    content = content.replace(/import \{ supabase \} from '\.\.\/utils\/supabase';/g, "import { api } from '../lib/api';"); // Fallback

    // Variable renaming
    for (const [oldName, newName] of Object.entries(mapping)) {
        // Replace exact word matches
        const regex = new RegExp(`\\b${oldName}\\b`, 'g');
        content = content.replace(regex, newName);
    }

    if (content !== originalContent) {
        fs.writeFileSync(filepath, content, 'utf-8');
        console.log(`Modified ${filepath}`);
    }
}

// Find files manually since glob might not be installed globally
function findFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(findFiles(file));
        } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
            results.push(file);
        }
    });
    return results;
}

const files = findFiles('F:/Teen-Pay/src');
files.forEach(processFile);
