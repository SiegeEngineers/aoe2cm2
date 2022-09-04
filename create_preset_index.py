#! /usr/bin/env python3

from datetime import datetime, timezone
import sys
import json
from pathlib import Path

def main():
    number_of_days = 1
    try:
        number_of_days = int(sys.argv[1])
    except Exception:
        pass

    info = {'presets':[], 'drafts':{}, 'timestamp': {'presets':'', 'drafts':''}}
    output_json = Path(__file__).with_name('presets-and-drafts.json')
    if output_json.exists():
        info = json.loads(output_json.read_text())

    known_preset_ids = set(item['code'] for item in info['presets'])
    presets_dir = Path(__file__).parent / 'presets'
    now = datetime.now(tz=timezone.utc)
    info['timestamp']['presets'] = str(now)
    limit = now.timestamp() - (60*60*24*number_of_days)

    for f in presets_dir.glob('*.json'):
        mtime = f.stat().st_mtime
        if mtime > limit:
            try:
                data = json.loads(f.read_text())
                preset_id = f.stem
                name = data['name']
                if preset_id not in known_preset_ids:
                    info['presets'].append({'code':preset_id, 'name':name, 'created':mtime})
                    known_preset_ids.add(preset_id)
            except json.decoder.JSONDecodeError:
                print(f'Not a valid json file: {f}')
    info['presets'] = sorted(info['presets'], key=lambda x: (x['name'], x['created']))
    output_json.write_text(json.dumps(info, sort_keys=True))

if __name__ == '__main__':
    main()
