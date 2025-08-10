import Editor from "@monaco-editor/react";
import { useEffect, useMemo, useState } from "react";
import { fs } from "@/os/fs";
import { Button } from "@/components/ui/button";

export default function CodeEditorApp() {
  const [path, setPath] = useState<string>("/home/user/notes.js");
  const [code, setCode] = useState<string>("console.log('NebulaOS ready')");
  const [output, setOutput] = useState<string>("");

  useEffect(() => {
    try { setCode(fs.readFile(path)); } catch {}
  }, [path]);

  const run = () => {
    const logs: string[] = [];
    const original = console.log;
    console.log = (...args) => { logs.push(args.map(String).join(' ')); };
    try {
      // eslint-disable-next-line no-new-func
      new Function(code)();
      setOutput(logs.join('\n'));
    } catch (e: any) {
      setOutput('Error: ' + e.message);
    } finally {
      console.log = original;
    }
  };

  const save = () => {
    fs.writeFile(path, code);
  };

  return (
    <div className="w-full h-full grid grid-rows-[auto_1fr_auto]">
      <div className="flex items-center gap-2 p-2 border-b">
        <input
          value={path}
          onChange={(e) => setPath(e.target.value)}
          className="w-72 rounded-md border bg-background px-2 py-1"
          aria-label="File path"
        />
        <Button variant="secondary" onClick={save}>Save</Button>
        <Button variant="default" onClick={run}>Run</Button>
      </div>
      <div className="grid grid-cols-2 h-full">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          theme="vs-dark"
          value={code}
          onChange={(v) => setCode(v ?? '')}
          options={{ fontSize: 14, minimap: { enabled: false } }}
        />
        <div className="p-2 text-sm overflow-auto">
          <div className="font-medium mb-1">Output</div>
          <pre className="whitespace-pre-wrap">{output || 'Run the code to see output here.'}</pre>
        </div>
      </div>
      <div className="p-2 text-xs text-muted-foreground border-t">Tip: Edit path to open other files in the virtual FS.</div>
    </div>
  );
}
