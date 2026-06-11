import re
from pathlib import Path

components = list(Path('src').rglob('*.component.ts'))

for path in components:
    content = path.read_text()
    original = content
    
    # 1. Add ChangeDetectionStrategy to @angular/core import
    core_import_match = re.search(r'import\s*\{\s*([^}]+)\}\s*from\s*["\']@angular/core["\']', content)
    if core_import_match:
        imports = core_import_match.group(1)
        if 'ChangeDetectionStrategy' not in imports:
            new_imports = imports.rstrip() + ', ChangeDetectionStrategy'
            content = content.replace(imports, new_imports, 1)
    
    # 2. Add changeDetection to @Component decorator
    if 'changeDetection' not in content:
        old = '@Component({'
        new = '@Component({\n  changeDetection: ChangeDetectionStrategy.OnPush,'
        content = content.replace(old, new, 1)
    
    if content != original:
        path.write_text(content)
        print(f'OK {path}')
    else:
        print(f'SKIP {path}')

print(f'Total: {len(components)} componentes')
