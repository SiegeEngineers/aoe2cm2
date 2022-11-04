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

    info = {'presets':[], 'drafts':{}, 'drafts_by_preset_id':{}, 'drafts_by_title':{}, 'timestamp': {'presets':'', 'drafts':''}}
    output_json = Path(__file__).with_name('presets-and-drafts.json')
    if output_json.exists():
        info = json.loads(output_json.read_text())

    known_draft_ids = set(info['drafts'].keys())
    drafts_dir = Path(__file__).parent / 'data'
    now = datetime.now(tz=timezone.utc)
    info['timestamp']['drafts'] = str(now)
    limit = now.timestamp() - (60*60*24*number_of_days)

    for subdir in drafts_dir.glob('*'):
        for f in subdir.glob('*.json'):
            mtime = f.stat().st_mtime
            if mtime > limit:
                try:
                    draft_id = f.stem
                    if draft_id in known_draft_ids:
                        continue
                    
                    data = json.loads(f.read_text())
                    preset_id = data['preset'].get('presetId', '<none>')
                    title = data['preset']['name']
                    host = data['nameHost']
                    guest = data['nameGuest']
                    
                    info['drafts'][draft_id] = {'host':host, 'guest':guest, 'created':mtime}
                    
                    if preset_id not in info['drafts_by_preset_id']:
                        info['drafts_by_preset_id'][preset_id] = []
                    info['drafts_by_preset_id'][preset_id].append(draft_id)
                    
                    if title not in info['drafts_by_title']:
                        info['drafts_by_title'][title] = []
                    info['drafts_by_title'][title].append(draft_id)
                    
                    known_draft_ids.add(draft_id)
                except json.decoder.JSONDecodeError:
                    print(f'Not a valid json file: {f}')
                    
    for preset_id in info['drafts_by_preset_id']:
        info['drafts_by_preset_id'][preset_id] = sorted(info['drafts_by_preset_id'][preset_id], reverse=True, key=lambda draft_id: info['drafts'][draft_id]['created'])
        
    for title in info['drafts_by_title']:
        info['drafts_by_title'][title] = sorted(info['drafts_by_title'][title], reverse=True, key=lambda draft_id: info['drafts'][draft_id]['created'])
        
    output_json.write_text(json.dumps(info, sort_keys=True))

if __name__ == '__main__':
    main()
