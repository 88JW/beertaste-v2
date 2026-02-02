#!/usr/bin/env python3
import base64
import sys

# Minimalna 1x1 szara PNG w base64
minimal_gray_png = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mOcOnXqfwAGfgLYttYINwAAAABJRU5ErkJggg=="

sizes = [72, 96, 128, 144, 152, 192, 384, 512]

for size in sizes:
    # Dla uproszczenia tworzymy prawdziwy prosty PNG (szary kwadrat)
    # Nagłówek PNG + szary piksel rozciągnięty
    png_data = base64.b64decode(minimal_gray_png)
    
    filename = f'icon-{size}x{size}.png'
    with open(filename, 'wb') as f:
        f.write(png_data)
    
    print(f'Created {filename}')

print('Done! Now rebuild Docker.')
