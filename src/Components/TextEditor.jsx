import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { EditorContent, useEditor } from '@tiptap/react';
import Bold from '@tiptap/extension-bold';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Highlight from '@tiptap/extension-highlight';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import Heading from '@tiptap/extension-heading';
const TextEditor = () => {
  const [text, setText] = useState('');
  const [rows, setRows] = useState(5);
  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Bold,
      Italic,
      Underline,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Highlight.configure({
        multicolor: true, // Allow multiple highlight colors
      }),
    ],
    content: text,
  });

  if (!editor) {
    return null;
  }

  const handleInputChange = (e) => {
    const newText = e.target.value;
    setText(newText);

    const lineCount = newText.split('\n').length;
    setRows(Math.max(lineCount, 5));

    editor.commands.setContent(newText);
  };


  const applyHighlight = (color) => {
    editor.chain().focus().setHighlight({ color }).run();
  };
  const applyitalic=(e)=>{
    editor.chain().focus().setItalic(e.target.value).run();
  }


  return (
    <div className="flex-col justify-center text-center">
      <nav className="flex justify-center text-center  gap-10 bg-gray-400">
        <Button  onClick={() => editor.chain().focus().setBold().run()}
            disabled={editor.isActive('bold')}  className="mr-2 text-white bg-black h-10 rounded w-[4rem]">
           Bold
        </Button>
        <button
            onClick={() => editor.chain().focus().unsetBold().run()}
            disabled={!editor.isActive('bold')}
            className="mr-2 text-white bg-black h-10 rounded w-[6rem]"
          >
            Unset bold
          </button>
        <div className="flex-col ">
          <button
            value="highlightColor"
            className="text-white bg-gray-700 hover:bg-gray-600 h-10 rounded w-[4rem]"
          >
            Markers
          </button>
          <div className="flex justify-evenly gap-3 mt-3 ">
            <button
              onClick={() => applyHighlight('#FF9D23')}
              style={{ backgroundColor: '#FF9D23', color: '#000' }}
              className="bg-orange-500 border-2px border-black h-10 rounded w-[4rem]"
            >
              Orange
            </button>
            <button
              onClick={() => applyHighlight('#16C47F')}
              className="bg-green-500 border-2px border-black h-10 rounded w-[4rem]"
            >
              Green
            </button>
            <button
              onClick={() => applyHighlight('#FFD65A')}
              className="bg-yellow-500 border-2px border-black h-10 rounded w-[4rem]"
            >
              Yellow
            </button>
            <button
              onClick={() => applyHighlight('#EFB6C8')}
              className="bg-pink-500 border-2px border-black h-10 rounded w-[4rem]"
            >
              Pink
            </button>
            <button
              onClick={() => applyHighlight('#D0DDD0')}
              className="bg-gray-500 border-2px border-black h-10 rounded w-[4rem]"
            >
              Grey
            </button>
          </div>
        </div>
        <button
            className="mr-2 text-white bg-black h-10 rounded w-[6rem]"
            onClick={() => editor.chain().focus().setItalic().run()}
            disabled={editor.isActive('italic')}
          >
            Set italic
          </button>
          <button
           className="mr-2 text-white bg-black h-10 rounded w-[6rem]"
            onClick={() => editor.chain().focus().unsetItalic().run()}
            disabled={!editor.isActive('italic')}
          >
            Unset italic
          </button>
          <button
           className="mr-2 text-white bg-black h-10 rounded w-[6rem]"
            onClick={() => editor.chain().focus().setUnderline().run()}
            disabled={editor.isActive('underline')}
          >
            Underline
          </button>
          <button
           className="mr-2 text-white bg-black h-12 rounded w-[6rem]"
           onClick={() => editor.chain().focus().unsetUnderline().run()}
           disabled={!editor.isActive('underline')}
          >
           Unset underline
          </button>
          <div className="flex-col ">
          </div>
      </nav>

      <div className="max-w-xl mx-auto mt-10 p-4 bg-gray-100 rounded shadow-lg">
        <h1 className="text-xl font-bold mb-4">Text Editor</h1>

        <EditorContent
          editor={editor}
          value={text}
          onChange={handleInputChange}
          rows={rows}
          placeholder="Write your text here..."
          className="w-full border border-gray-300 rounded p-4 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
         
        />
      </div>
    </div>
  );
};

export default TextEditor;
