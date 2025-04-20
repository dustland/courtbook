#!/bin/bash

# Script to update Sass @import statements to @use

echo "Updating Sass @import statements to @use syntax..."

# Find all SCSS files with @import statements
files=$(grep -l "@import" --include="*.scss" -r src/)

for file in $files; do
  echo "Processing file: $file"
  
  # Update @import statements to @use
  sed -i '' 's/@import "\(.*\)";/@use "\1" as vars;/g' "$file"
  
  # Update variable references (remove $ prefix and add vars.)
  sed -i '' 's/\$\([a-zA-Z0-9_-]*\)/vars\.\$\1/g' "$file"
done

echo "Done! Updated $(echo "$files" | wc -l | tr -d ' ') files."
echo "⚠️  Note: You may need to manually check files for correct namespace usage." 