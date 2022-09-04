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

    known_draft_ids = set()
    for title in info['drafts']:
        for item in info['drafts'][title]:
            known_draft_ids.add(item['code'])
    drafts_dir = Path(__file__).parent / 'data'
    now = datetime.now(tz=timezone.utc)
    info['timestamp']['drafts'] = str(now)
    limit = now.timestamp() - (60*60*24*number_of_days)

    for subdir in drafts_dir.glob('*'):
        for f in subdir.glob('*.json'):
            mtime = f.stat().st_mtime
            if mtime > limit:
                try:
                    data = json.loads(f.read_text())
                    draft_id = f.stem
                    title = data['preset']['name']
                    host = data['nameHost']
                    guest = data['nameGuest']
                    if title not in info['drafts']:
                        info['drafts'][title] = []
                    if draft_id not in known_draft_ids:
                        info['drafts'][title].append({'code': draft_id, 'host':host, 'guest':guest, 'created':mtime})
                        known_draft_ids.add(draft_id)
                except json.decoder.JSONDecodeError:
                    print(f'Not a valid json file: {f}')
    for title in info['drafts']:
        info['drafts'][title] = sorted(info['drafts'][title], reverse=True, key=lambda x: x['created'])
    output_json.write_text(json.dumps(info, sort_keys=True))

if __name__ == '__main__':
    main()
