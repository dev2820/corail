pnpm run build
git add dist/*
git commit -m "chore/ build"
pnpm version patch
git push origin --tags