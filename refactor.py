import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    
    # Imports
    content = content.replace("import { supabase } from '../../lib/supabase';", "import { api } from '../../lib/api';")
    content = content.replace("import { supabase } from '../lib/supabase';", "import { api } from '../lib/api';")
    content = content.replace("import { supabase } from '../../../lib/supabase';", "import { api } from '../../../lib/api';")
    
    # Rename variables
    mapping = {
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
        'auth_user_id': 'authUserId',  # Might need manual check
        'credited_to_user_id': 'creditedToUserId',
        'credited_at': 'creditedAt',
        'processed_at': 'processedAt',
        'verification_deadline': 'verificationDeadline',
        'estimated_approval_date': 'estimatedApprovalDate',
        'suspension_reason': 'suspensionReason',
        'suspended_at': 'suspendedAt',
        'suspended_by': 'suspendedBy',
    }
    
    for old, new in mapping.items():
        content = content.replace(old, new)
        
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Modified {filepath}")

def main():
    import glob
    for filepath in glob.glob('F:/Teen-Pay/src/**/*.tsx', recursive=True) + glob.glob('F:/Teen-Pay/src/**/*.ts', recursive=True):
        process_file(filepath)

if __name__ == '__main__':
    main()
