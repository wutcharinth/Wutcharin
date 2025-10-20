#!/bin/bash

# Script to delete old repositories
# WARNING: This is irreversible! Review before running.

echo "⚠️  WARNING: This will permanently delete the following repositories:"
echo ""
echo "  - wutcharinthatan.me"
echo "  - splitbill-ai-b40ffd6b"
echo "  - FFTT"
echo "  - Data-Science--Cheat-Sheet"
echo "  - basic-dataset"
echo "  - Python-Tutorials"
echo "  - seaborn"
echo "  - pandas"
echo "  - ds_2561_2"
echo "  - Pandas-exercises"
echo "  - Hands-On-Data-Science-and-Python-Machine-Learning"
echo "  - Data-Science-45min-Intros"
echo ""
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Deletion cancelled."
    exit 0
fi

echo ""
echo "Deleting repositories..."
echo ""

# Delete each repository
gh repo delete wutcharinth/wutcharinthatan.me --yes
gh repo delete wutcharinth/splitbill-ai-b40ffd6b --yes
gh repo delete wutcharinth/FFTT --yes
gh repo delete wutcharinth/Data-Science--Cheat-Sheet --yes
gh repo delete wutcharinth/basic-dataset --yes
gh repo delete wutcharinth/Python-Tutorials --yes
gh repo delete wutcharinth/seaborn --yes
gh repo delete wutcharinth/pandas --yes
gh repo delete wutcharinth/ds_2561_2 --yes
gh repo delete wutcharinth/Pandas-exercises --yes
gh repo delete wutcharinth/Hands-On-Data-Science-and-Python-Machine-Learning --yes
gh repo delete wutcharinth/Data-Science-45min-Intros --yes

echo ""
echo "✅ All repositories deleted successfully!"

