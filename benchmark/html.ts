export const html = `
<div class="Main"><div class="Title">rollup 插件开发</div><div style="padding: 16px 20px;"><div class="md"><h1 id="虚拟模块实例">虚拟模块实例</h1>
<p>在开始学习 <code>rollup</code> 之前，我们先来讲解一下虚拟模块，虚拟模块指的是不通过文件系统就可以访问的成员，举一个例子：</p>
<ul>
<li>在开发 <code>vue</code> 项目的时候，我们可以引入 <code>.vue</code> 文件，这得益于 <code>vite</code> 工具提供的虚拟模块，而在其他环境中，引入 <code>.vue</code> 会报错</li>
</ul>
<p>一个虚拟模块的例子：</p>
<pre><code class="hljs language-typescript"><span class="hljs-comment">// index.js</span>
<span class="hljs-keyword">import</span> v <span class="hljs-keyword">from</span> <span class="hljs-string">'virtual-module'</span>
<span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(v)
</code></pre>
<p><code>virtual-module</code> 这个依赖我们并没有安装，如果你直接运行这个 js 文件，会报错，所以我们借助 <code>rollup</code> 打包实现：</p>
<pre><code class="hljs language-javascript"><span class="hljs-comment">// rollup.config.js</span>
<span class="hljs-keyword">function</span> <span class="hljs-title function_">myExample</span>(<span class="hljs-params"></span>) {
  <span class="hljs-keyword">return</span> {
  	<span class="hljs-attr">name</span>: <span class="hljs-string">'rollup-plugin-virtual-example'</span>, <span class="hljs-comment">// rollup 插件规范，应该以 rollup-plugin- 作为前缀,</span>
    <span class="hljs-comment">// 处理 esm</span>
  	<span class="hljs-title function_">resolveId</span>(<span class="hljs-params">source</span>) {
      <span class="hljs-comment">// 如果 import 的名字是 'virtual-module'</span>
      <span class="hljs-keyword">if</span> (source === <span class="hljs-string">'virtual-module'</span>) {
        <span class="hljs-keyword">return</span> <span class="hljs-string">'export default "this is virtual-module"'</span>
      }
      <span class="hljs-comment">// 返回 null 表示 rollup 不做任何额外处理</span>
      <span class="hljs-keyword">return</span> <span class="hljs-literal">null</span>
    }
  }
}

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> {
  <span class="hljs-attr">input</span>: <span class="hljs-string">'./index.js'</span>,
  <span class="hljs-attr">plugins</span>: [<span class="hljs-title function_">myExample</span>()],
  <span class="hljs-attr">output</span>:[{
    <span class="hljs-attr">file</span>: <span class="hljs-string">'bundle.js'</span>,
    <span class="hljs-attr">format</span>: <span class="hljs-string">'es'</span>
  }]
}
</code></pre>
<p>运行 <code>rollup --config</code>，即可看到打包文件：</p>
<pre><code class="hljs language-javascript"><span class="hljs-keyword">var</span> v = <span class="hljs-string">"this is virtual"</span>;

<span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(v);
</code></pre>
<blockquote>
<p><strong>约定</strong></p>
<ul>
<li>插件应该有一个明确的名称，并以 <code>rollup-plugin-</code> 作为前缀。</li>
<li>在 <code>package.json</code> 中包含 <code>rollup-plugin</code> 关键字。</li>
<li>插件应该被测试，我们推荐 <a href="https://github.com/mochajs/mocha">mocha</a> 或 <a href="https://github.com/avajs/ava">ava</a>，它们支持 Promise。</li>
<li>可能的话，使用异步方法，例如 <code>fs.readFile</code> 而不是 <code>fs.readFileSync</code></li>
<li>用英文文档描述你的插件。</li>
<li>确保如果适当，你的插件输出正确的源映射。</li>
<li>如果插件使用“虚拟模块”（例如用于辅助函数），请使用<code>\0</code>前缀模块 ID。这可以防止其他插件尝试处理它。</li>
</ul>
</blockquote>
<h1 id="生命钩子周期">生命钩子周期</h1>
<p><code>rollup</code> 有各种钩子，编写插件时需要掌握各个钩子执行的顺序</p>
<p><img loading="lazy" src="https://plumbiu.github.io/blogImg/image-20230823223520895.png" alt="image-20230823223520895"></p>
<h1 id="options">options</h1>
<p><code>options</code> 钩子是构建阶段的第一个钩子，它的类型如下：</p>
<pre><code class="hljs language-typescript">delcare <span class="hljs-attr">options</span>: <span class="hljs-function">(<span class="hljs-params">options: InputOptions</span>) =&gt;</span> <span class="hljs-title class_">InputOptions</span> | <span class="hljs-literal">null</span>

<span class="hljs-keyword">interface</span> <span class="hljs-title class_">InputOptions</span> {
	acorn?: <span class="hljs-title class_">Record</span>&lt;<span class="hljs-built_in">string</span>, <span class="hljs-built_in">unknown</span>&gt;;
	acornInjectPlugins?: (<span class="hljs-function">(<span class="hljs-params">...arguments_: <span class="hljs-built_in">any</span>[]</span>) =&gt;</span> <span class="hljs-built_in">unknown</span>)[] | (<span class="hljs-function">(<span class="hljs-params">...arguments_: <span class="hljs-built_in">any</span>[]</span>) =&gt;</span> <span class="hljs-built_in">unknown</span>);
	cache?: <span class="hljs-built_in">boolean</span> | <span class="hljs-title class_">RollupCache</span>;
	context?: <span class="hljs-built_in">string</span>;
	experimentalCacheExpiry?: <span class="hljs-built_in">number</span>;
	experimentalLogSideEffects?: <span class="hljs-built_in">boolean</span>;
	external?: <span class="hljs-title class_">ExternalOption</span>;
	inlineDynamicImports?: <span class="hljs-built_in">boolean</span>;
	input?: <span class="hljs-title class_">InputOption</span>;
	logLevel?: <span class="hljs-title class_">LogLevelOption</span>;
	makeAbsoluteExternalsRelative?: <span class="hljs-built_in">boolean</span> | <span class="hljs-string">'ifRelativeSource'</span>;
	manualChunks?: <span class="hljs-title class_">ManualChunksOption</span>;
	maxParallelFileOps?: <span class="hljs-built_in">number</span>;
	maxParallelFileReads?: <span class="hljs-built_in">number</span>;
	moduleContext?: (<span class="hljs-function">(<span class="hljs-params">id: <span class="hljs-built_in">string</span></span>) =&gt;</span> <span class="hljs-built_in">string</span> | <span class="hljs-title class_">NullValue</span>) | { [<span class="hljs-attr">id</span>: <span class="hljs-built_in">string</span>]: <span class="hljs-built_in">string</span> };
	onLog?: <span class="hljs-title class_">LogHandlerWithDefault</span>;
	onwarn?: <span class="hljs-title class_">WarningHandlerWithDefault</span>;
	perf?: <span class="hljs-built_in">boolean</span>;
	plugins?: <span class="hljs-title class_">InputPluginOption</span>;
	preserveEntrySignatures?: <span class="hljs-title class_">PreserveEntrySignaturesOption</span>;
	preserveModules?: <span class="hljs-built_in">boolean</span>;
	preserveSymlinks?: <span class="hljs-built_in">boolean</span>;
	shimMissingExports?: <span class="hljs-built_in">boolean</span>;
	strictDeprecations?: <span class="hljs-built_in">boolean</span>;
	treeshake?: <span class="hljs-built_in">boolean</span> | <span class="hljs-title class_">TreeshakingPreset</span> | <span class="hljs-title class_">TreeshakingOptions</span>;
	watch?: <span class="hljs-title class_">WatcherOptions</span> | <span class="hljs-literal">false</span>;
}
</code></pre>
<p>官方介绍是替换或操作传递给 <code>rollup.rollup</code> 配置选项</p>
<p>使用此钩子的应用场景是，只需要读取选项，因为该钩子可以访问所有 <code>options</code> 钩子的转换考虑后的选项</p>
<h1 id="buildstart">buildStart</h1>
<p><code>buildStart</code> 会在每个 <code>rollup.rollup</code> 构建上调用，此钩子使用场景是需要访问 <code>rollup.rollup</code> 的选项时，它考虑了所有 <code>options</code> 钩子的转换，并且还包含未设置选项的正确默认值，类型：</p>
<pre><code class="hljs language-typescript"><span class="hljs-keyword">declare</span> <span class="hljs-attr">buildStart</span>: <span class="hljs-function">(<span class="hljs-params">options: InputOptions</span>) =&gt;</span> <span class="hljs-built_in">void</span>
</code></pre>
<h1 id="resolveid">resolveId</h1>
<p>重头戏，让我们先看代码，看看打包之后会发生什么：</p>
<pre><code class="hljs language-typescript"><span class="hljs-comment">// 官方的示例：</span>
<span class="hljs-keyword">const</span> <span class="hljs-variable constant_">POLYFILL_ID</span> = <span class="hljs-string">'\0polyfill'</span>;
<span class="hljs-keyword">const</span> <span class="hljs-variable constant_">PROXY_SUFFIX</span> = <span class="hljs-string">'?inject-polyfill-proxy'</span>;

<span class="hljs-keyword">export</span> <span class="hljs-keyword">function</span> <span class="hljs-title function_">injectPolyfillPlugin</span>(<span class="hljs-params"></span>) {
	<span class="hljs-keyword">return</span> {
		<span class="hljs-attr">name</span>: <span class="hljs-string">'inject-polyfill'</span>,
		<span class="hljs-keyword">async</span> <span class="hljs-title function_">resolveId</span>(<span class="hljs-params">source, importer, options</span>) {
			<span class="hljs-keyword">if</span> (source === <span class="hljs-variable constant_">POLYFILL_ID</span>) {
				<span class="hljs-keyword">return</span> { <span class="hljs-attr">id</span>: <span class="hljs-variable constant_">POLYFILL_ID</span>, <span class="hljs-attr">moduleSideEffects</span>: <span class="hljs-literal">true</span> };
			}
			<span class="hljs-keyword">if</span> (options.<span class="hljs-property">isEntry</span>) {
				<span class="hljs-keyword">const</span> resolution = <span class="hljs-keyword">await</span> <span class="hljs-variable language_">this</span>.<span class="hljs-title function_">resolve</span>(source, importer, {
					<span class="hljs-attr">skipSelf</span>: <span class="hljs-literal">true</span>,
					...options
				});
				<span class="hljs-keyword">if</span> (!resolution || resolution.<span class="hljs-property">external</span>) <span class="hljs-keyword">return</span> resolution;
				<span class="hljs-keyword">const</span> moduleInfo = <span class="hljs-keyword">await</span> <span class="hljs-variable language_">this</span>.<span class="hljs-title function_">load</span>(resolution);
				moduleInfo.<span class="hljs-property">moduleSideEffects</span> = <span class="hljs-literal">true</span>;
				<span class="hljs-keyword">return</span> <span class="hljs-string"><span class="hljs-subst">resolution.id}</span><span class="hljs-subst">PROXY_SUFFIX}</span></span>;
			}
			<span class="hljs-keyword">return</span> <span class="hljs-literal">null</span>;
		},
		<span class="hljs-title function_">load</span>(<span class="hljs-params">id</span>) {
      <span class="hljs-keyword">if</span> (id === <span class="hljs-variable constant_">POLYFILL_ID</span>) {
				<span class="hljs-keyword">return</span> <span class="hljs-string">"console.log('polyfill');"</span>;
			}
			<span class="hljs-keyword">if</span> (id.<span class="hljs-title function_">endsWith</span>(<span class="hljs-variable constant_">PROXY_SUFFIX</span>)) {
        <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>({ id })
				<span class="hljs-keyword">const</span> entryId = id.<span class="hljs-title function_">slice</span>(<span class="hljs-number">0</span>, -<span class="hljs-variable constant_">PROXY_SUFFIX</span>.<span class="hljs-property">length</span>);
				<span class="hljs-keyword">const</span> { hasDefaultExport } = <span class="hljs-variable language_">this</span>.<span class="hljs-title function_">getModuleInfo</span>(entryId);
				<span class="hljs-keyword">let</span> code =
					<span class="hljs-string">import <span class="hljs-subst"><span class="hljs-built_in">JSON</span>.stringify(POLYFILL_ID)}</span>;</span> +
					<span class="hljs-string">export * from <span class="hljs-subst"><span class="hljs-built_in">JSON</span>.stringify(entryId)}</span>;</span>;
				<span class="hljs-keyword">if</span> (hasDefaultExport) {
					code += <span class="hljs-string">export { default } from <span class="hljs-subst"><span class="hljs-built_in">JSON</span>.stringify(entryId)}</span>;</span>;
				}
				<span class="hljs-keyword">return</span> code;
			}
			<span class="hljs-keyword">return</span> <span class="hljs-literal">null</span>;
		}
	};
}
</code></pre>
<pre><code class="hljs language-javascript"><span class="hljs-comment">// test.js</span>
<span class="hljs-keyword">export</span> <span class="hljs-keyword">function</span> <span class="hljs-title function_">a</span>(<span class="hljs-params"></span>) {
  <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">'hello a'</span>)
}
<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-string">'hello test'</span>
</code></pre>
<p>打包后的文件：</p>
<pre><code class="hljs language-javascript"><span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">'polyfill'</span>);

<span class="hljs-keyword">function</span> <span class="hljs-title function_">a</span>(<span class="hljs-params"></span>) {
  <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">'hello a'</span>);
}
<span class="hljs-keyword">var</span> test = <span class="hljs-string">'hello test'</span>;

<span class="hljs-keyword">export</span> { a, test <span class="hljs-keyword">as</span> <span class="hljs-keyword">default</span> };
</code></pre>
<p>可以看出了开头多了一句打印信息，那么这期间发生了什么呢？</p>
<ol>
<li><code>test.js</code> 首先进入 <code>resolveId</code>:</li>
</ol>
<p>由于 <code>test.js</code> 不含有 <code>\0polyfill</code> 的 importer，而它又是打包的入口文件，所以它会进入第二个 <code>if</code> 判断：</p>
<pre><code class="hljs language-javascript"><span class="hljs-keyword">if</span> (options.<span class="hljs-property">isEntry</span>) {
  <span class="hljs-comment">// </span>
  <span class="hljs-keyword">const</span> resolution = <span class="hljs-keyword">await</span> <span class="hljs-variable language_">this</span>.<span class="hljs-title function_">resolve</span>(source, importer, {
    <span class="hljs-comment">// skipSelf 可以避免一直解析自己导致的死循环</span>
    <span class="hljs-attr">skipSelf</span>: <span class="hljs-literal">true</span>,
    ...options
  });
  <span class="hljs-comment">// 如果 resolution 不存在或者存在外部导入，那么直接返回</span>
  <span class="hljs-keyword">if</span> (!resolution || resolution.<span class="hljs-property">external</span>) <span class="hljs-keyword">return</span> resolution;
  <span class="hljs-keyword">const</span> moduleInfo = <span class="hljs-keyword">await</span> <span class="hljs-variable language_">this</span>.<span class="hljs-title function_">load</span>(resolution);
  moduleInfo.<span class="hljs-property">moduleSideEffects</span> = <span class="hljs-literal">true</span>;
  <span class="hljs-keyword">return</span> <span class="hljs-string"><span class="hljs-subst">resolution.id}</span><span class="hljs-subst">PROXY_SUFFIX}</span></span>;
}
</code></pre>
<ol start="2">
<li>上述代码进入 <code>load</code></li>
</ol>
<p>由于上述代码最终返回了一个额外的 <code>PROXY_SUFFIX</code> 所以 <code>load</code> API 也会进入第二个 if：</p>
<pre><code class="hljs language-javascript"><span class="hljs-keyword">if</span> (id.<span class="hljs-title function_">endsWith</span>(<span class="hljs-variable constant_">PROXY_SUFFIX</span>)) {
  <span class="hljs-comment">// 拿到入口文件的 Id</span>
  <span class="hljs-keyword">const</span> entryId = id.<span class="hljs-title function_">slice</span>(<span class="hljs-number">0</span>, -<span class="hljs-variable constant_">PROXY_SUFFIX</span>.<span class="hljs-property">length</span>);
  <span class="hljs-comment">// 是否有默认导出</span>
  <span class="hljs-keyword">const</span> { hasDefaultExport } = <span class="hljs-variable language_">this</span>.<span class="hljs-title function_">getModuleInfo</span>(entryId);
  <span class="hljs-comment">// code 将 POLYFILL_ID 作为 importer，这个 importer 同样也会被 resolveId 识别</span>
  <span class="hljs-keyword">let</span> code =
      <span class="hljs-string">import <span class="hljs-subst"><span class="hljs-built_in">JSON</span>.stringify(POLYFILL_ID)}</span>;</span> +
      <span class="hljs-string">export * from <span class="hljs-subst"><span class="hljs-built_in">JSON</span>.stringify(entryId)}</span>;</span>;
  <span class="hljs-comment">// 命名空间重新导出不会重新导出默认值</span>
  <span class="hljs-comment">// 因此我们需要特殊处理</span>
  <span class="hljs-keyword">if</span> (hasDefaultExport) {
    code += <span class="hljs-string">export { default } from <span class="hljs-subst"><span class="hljs-built_in">JSON</span>.stringify(entryId)}</span>;</span>;
  }
  <span class="hljs-keyword">return</span> code;
}
</code></pre>
<ol start="3">
<li>上述 <code>code</code> 代码再次进入 <code>resolveId</code></li>
</ol>
<p>由于上述代码包含 <code>POLYFILL_ID</code> importer，所以会直接进入第一个 <code>if</code> 判断：</p>
<pre><code class="hljs language-javascript"><span class="hljs-keyword">if</span> (source === <span class="hljs-variable constant_">POLYFILL_ID</span>) {
  <span class="hljs-comment">// 对于polyfill，必须始终考虑副作用</span>
  <span class="hljs-comment">// 否则使用 "treeshake.moduleSideEffects: false"</span>
  <span class="hljs-comment">// 这样可能会阻止包含polyfill</span>
  <span class="hljs-keyword">return</span> { <span class="hljs-attr">id</span>: <span class="hljs-variable constant_">POLYFILL_ID</span>, <span class="hljs-attr">moduleSideEffects</span>: <span class="hljs-literal">true</span> };
}
</code></pre>
<p><code>polyfill</code> 简单来说就是打补丁，比如远古 ie 浏览器不支持 es6 语法时，就是通过 <code>polyfill</code> 的方式支持，而 <code>roolup</code> 规定，对于 <code>polyfill</code> 必须不设置 <code>treeshake</code>，即将 <code>moduleSideEffects</code> 设置为 true，考虑副作用</p>
<ol start="4">
<li>再次进入 <code>load</code></li>
</ol>
<p>上述代码返回的 id 正是 <code>POLYFILL_ID</code>，所以正好进入第一个 if：</p>
<pre><code class="hljs language-javascript"><span class="hljs-keyword">if</span> (id === <span class="hljs-variable constant_">POLYFILL_ID</span>) {
  <span class="hljs-comment">// 用实际的 polyfill 替换</span>
  <span class="hljs-keyword">return</span> <span class="hljs-string">"console.log('polyfill');"</span>;
}
</code></pre>
<p>最后查看打包后的文件：</p>
<pre><code class="hljs language-typescript"><span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">'polyfill'</span>);

<span class="hljs-keyword">function</span> <span class="hljs-title function_">a</span>(<span class="hljs-params"></span>) {
  <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">'hello a'</span>);
}
<span class="hljs-keyword">var</span> test = <span class="hljs-string">'hello test'</span>;

<span class="hljs-keyword">export</span> { a, test <span class="hljs-keyword">as</span> <span class="hljs-keyword">default</span> };
</code></pre>
<h1 id="load">load</h1>
<p>官方对 <code>load</code> 的定义是定义自定义加载器，该钩子可以返回一个 <code>{ code, ast, map }</code> 对象</p>
<pre><code class="hljs language-typescript"><span class="hljs-keyword">declare</span> <span class="hljs-attr">load</span>: <span class="hljs-function">(<span class="hljs-params">id: <span class="hljs-built_in">string</span></span>) =&gt;</span> <span class="hljs-title class_">LoadResult</span>

<span class="hljs-keyword">type</span> <span class="hljs-title class_">LoadResult</span> = <span class="hljs-built_in">string</span> | <span class="hljs-literal">null</span> | <span class="hljs-title class_">SourceDescription</span>;

<span class="hljs-keyword">interface</span> <span class="hljs-title class_">SourceDescription</span> {
	<span class="hljs-attr">code</span>: <span class="hljs-built_in">string</span>;
	map?: <span class="hljs-built_in">string</span> | <span class="hljs-title class_">SourceMap</span>;
	ast?: <span class="hljs-title class_">ESTree</span>.<span class="hljs-property">Program</span>;
	assertions?: { [<span class="hljs-attr">key</span>: <span class="hljs-built_in">string</span>]: <span class="hljs-built_in">string</span> } | <span class="hljs-literal">null</span>;
	meta?: { [<span class="hljs-attr">plugin</span>: <span class="hljs-built_in">string</span>]: <span class="hljs-built_in">any</span> } | <span class="hljs-literal">null</span>;
	moduleSideEffects?: <span class="hljs-built_in">boolean</span> | <span class="hljs-string">'no-treeshake'</span> | <span class="hljs-literal">null</span>;
	syntheticNamedExports?: <span class="hljs-built_in">boolean</span> | <span class="hljs-built_in">string</span> | <span class="hljs-literal">null</span>;
}
</code></pre>
<h1 id="transform">transform</h1>
<p><code>transform</code> 可用于转换单个模块，为了避免额外的解析开销，例如钩子已经使用了 <code>this.parse</code> 生成了 AST，此钩子可以选择性地返回一个 <code>{ code, ast, map }</code> 对象，在之前的 <code>vite插件开发一节中</code>，我们利用了 <code>transform</code> API 实现了按需引用 <code>antd</code> 功能</p></div><div id="Post-Bottom">Comment 页面</div></div></div>
`
