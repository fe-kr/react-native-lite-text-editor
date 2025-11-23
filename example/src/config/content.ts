export const content = `
  <!-- Block formatting -->
  <section class="block">
    <div class="label">Block formatting</div>
    <h1>Lorem ipsum dolor sit amet</h1>
    <h2>Consectetur adipiscing elit</h2>
    <h3>Sed do eiusmod tempor</h3>
    <p>Ut labore et dolore magna aliqua.</p>
    <blockquote>“Lorem ipsum dolor sit amet, consectetur adipiscing elit.”</blockquote>
    <pre><code>Lorem ipsum dolor sit amet,consectetur adipiscing elit.</code></pre>
  </section>

  <!-- Inline formatting -->
  <section class="block">
    <div class="label">Inline formatting</div>
    <p><b>Lorem ipsum dolor sit amet</b>, consectetur adipiscing elit.</p>
    <p><i>Lorem ipsum dolor sit amet</i>, consectetur adipiscing elit.</p>
    <p><u>Lorem ipsum dolor sit amet</u>, consectetur adipiscing elit.</p>
    <p><s>Lorem ipsum dolor sit amet</s>, consectetur adipiscing elit.</p>
    <p>Lorem ipsum H<sub>2</sub>O dolor sit amet.</p>
    <p>Lorem ipsum E = mc<sup>2</sup> dolor sit amet.</p>
  </section>

  <!-- Colors and font -->
  <section class="block">
    <div class="label">Colors and font</div>
    <p><span style="color: rgb(230, 153, 77)">Lorem ipsum dolor sit amet</span>, consectetur adipiscing elit.</p>
    <p><span style="background-color: rgb(77, 230, 77)">Lorem ipsum dolor sit amet</span>, consectetur adipiscing elit.</p>
    <p><span style="font-family: 'Courier New', Courier, monospace;">Lorem ipsum dolor sit amet</span>, consectetur adipiscing elit.</p>
    <p><span style="font-size: 24px;">Lorem ipsum dolor sit amet</span>, consectetur adipiscing elit.</p>
  </section>

  <!-- Alignment -->
  <section class="block">
    <div class="label">Alignment</div>
    <p style="text-align: left;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae arcu.</p>
    <p style="text-align: center;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae arcu.</p>
    <p style="text-align: right;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae arcu.</p>
    <p style="text-align: justify;">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ornare, sapien quis dapibus porta,
      arcu erat volutpat nisl, vel convallis ex nibh ac mi. Integer elementum felis nec lacinia varius.
    </p>
  </section>

  <!-- Lists -->
  <section class="block">
    <div class="label">Lists</div>
    <ul>
      <li>Lorem ipsum dolor sit amet</li>
      <li>Consectetur adipiscing elit</li>
      <li>Sed do eiusmod tempor</li>
    </ul>

     <ol>
      <li>Lorem ipsum dolor sit amet</li>
      <li>Consectetur adipiscing elit</li>
      <li>Sed do eiusmod tempor</li>
    </ol>
  </section>

  <!-- Indentation -->
  <section class="block">
    <div class="label">Indentation</div>
    <p style="margin-left: 2em;">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
    <p style="margin-left: 0;">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
  </section>

  <!-- Links -->
  <section class="block">
    <div class="label">Links</div>
    <p>
      <a href="https://google.com" target="_blank" rel="noopener">Lorem ipsum dolor sit amet</a>, consectetur adipiscing elit.
    </p>
    <p>Unlinked: <span>Lorem ipsum dolor sit amet</span></p>
  </section>

  <!-- Images -->
  <section class="block">
    <div class="label">Images</div>
    <p>
      <img src="./example.jpg" alt="Placeholder" />
    </p>
  </section>
`;
