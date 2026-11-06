#!/usr/bin/env python3
"""Inline core.js and tabs/*.js into index.html (v2). Head and base CSS come from ../index.html (v1)."""
import os,re,glob
here=os.path.dirname(os.path.abspath(__file__))
v1=open(os.path.join(here,'..','index.html'),encoding='utf-8').read()
head=v1[:v1.index('</style>')]
head=re.sub(r'<title>.*?</title>','<title>Retirement Plan v2</title>',head,flags=re.S)
css=open(os.path.join(here,'extra.css'),encoding='utf-8').read()
js=[open(os.path.join(here,'core.js'),encoding='utf-8').read()]+[open(f,encoding='utf-8').read() for f in sorted(glob.glob(os.path.join(here,'tabs','*.js')))]
body='''</style>
</head><body>
<div class="wrap">
  <header class="top">
    <div class="brand"><div class="eyebrow">Retirement, nursing and money · version 2 · private</div><h1 id="appName">Retirement Plan v2</h1></div>
    <div class="legend small"><span class="chip duty"><span class="dot duty"></span>Military</span><span class="chip study"><span class="dot study"></span>Nursing and school</span><span class="chip" style="background:var(--warn-bg);color:var(--accent)"><span class="dot" style="background:var(--accent)"></span>Personal and money</span></div>
  </header>
  <div id="fileBar"></div>
  <nav class="tabs" role="tablist" id="tabs"></nav>
  <main id="main"></main>
</div>
<div id="toast" class="toast" hidden></div>
<script id="rpdata" type="application/json">null</script>
'''
out=head+css+body+''.join(f'<script>\n{j.replace("</script","<\\/script")}\n</script>\n' for j in js)+'</body></html>\n'
open(os.path.join(here,'index.html'),'w',encoding='utf-8').write(out)
print('built',len(out),'bytes,',len(js),'scripts')
