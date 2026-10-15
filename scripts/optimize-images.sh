#!/bin/bash
# Optimize images over 1MB: resize to max 1600px wide and recompress

IMAGES_DIR="${1:-public/images}"
MAX_WIDTH=1600

echo "=== Image Optimization Script ==="
echo "Directory: $IMAGES_DIR"
echo "Max width: ${MAX_WIDTH}px"
echo ""

# Record before size
BEFORE_SIZE=$(du -sh "$IMAGES_DIR" | cut -f1)
echo "Before optimization: $BEFORE_SIZE"
echo ""

# Find all images over 1MB
COUNT=$(find "$IMAGES_DIR" -type f -size +1M \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" \) | wc -l)
echo "Files over 1MB: $COUNT"
echo ""

# Process each image
processed=0
find "$IMAGES_DIR" -type f -size +1M \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" \) | while read file; do
    filename=$(basename "$file")
    before_size=$(du -h "$file" | cut -f1)
    
    # Get current dimensions
    dimensions=$(identify -format "%wx%h" "$file" 2>/dev/null || echo "0x0")
    width=$(echo "$dimensions" | cut -dx -f1)
    
    # Only resize if width > MAX_WIDTH
    if [ "$width" -gt "$MAX_WIDTH" ] 2>/dev/null; then
        echo -n "Resizing $filename (${dimensions}, ${before_size})... "
        
        # For PNG: resize and optimize
        if [[ "$file" == *.png ]]; then
            convert "$file" -resize "${MAX_WIDTH}x>" -strip "$file"
        # For JPG: resize with quality 85
        elif [[ "$file" == *.jpg ]] || [[ "$file" == *.jpeg ]]; then
            convert "$file" -resize "${MAX_WIDTH}x>" -quality 85 -strip "$file"
        fi
        
        after_size=$(du -h "$file" | cut -f1)
        new_dimensions=$(identify -format "%wx%h" "$file" 2>/dev/null || echo "unknown")
        echo "done (${new_dimensions}, ${after_size})"
    else
        echo -n "Recompressing $filename (${dimensions}, ${before_size})... "
        
        # Just recompress without resizing
        if [[ "$file" == *.png ]]; then
            convert "$file" -strip "$file"
        elif [[ "$file" == *.jpg ]] || [[ "$file" == *.jpeg ]]; then
            convert "$file" -quality 85 -strip "$file"
        fi
        
        after_size=$(du -h "$file" | cut -f1)
        echo "done (${after_size})"
    fi
done

echo ""
echo "=== Summary ==="

# Record after size
AFTER_SIZE=$(du -sh "$IMAGES_DIR" | cut -f1)
echo "Before: $BEFORE_SIZE"
echo "After: $AFTER_SIZE"
echo "=== Done ==="
