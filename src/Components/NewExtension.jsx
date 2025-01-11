import React from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Extension } from '@tiptap/core';
import Sentiment from 'sentiment';  
import { jsPDF } from 'jspdf';
import Italic from '@tiptap/extension-italic';

// Sentiment analyzer setup
const sentimentAnalyzer = new Sentiment();

const emojiMap = {
  positive: "😊",
  negative: "😔",
  neutral: "😐",
};

// Emoji Extension for sentiment-based emojis
const EmojiExtension = Extension.create({
  name: 'emoji',

  addCommands() {
    return {
      addEmojiBasedOnSentiment: (text) => ({ commands }) => {
        const words = text.split(' ');
        const updatedText = words.map((word) => {
          const analysis = sentimentAnalyzer.analyze(word);
          const sentiment = analysis.score > 0
            ? 'positive'
            : analysis.score < 0
            ? 'negative'
            : 'neutral';
          return `${word} ${emojiMap[sentiment] || ''}`;
        });
        return updatedText.join(' ');
      },
    };
  },
});

// Export to PDF Extension
const ExportToPDFExtension = Extension.create({
  name: 'exportToPDF',

  addCommands() {
    return {
      exportToPDF: () => ({ editor }) => {
        const content = editor.getHTML();

        const doc = new jsPDF();
        doc.html(content, {
          callback: function (doc) {
            doc.save('document.pdf');
          },
          margin: [10, 10, 10, 10],
        });
      },
    };
  },
});

// Bold Extension for toggling bold text
const BoldEditor = Extension.create({
  name: 'BoldToggle',

  addCommands() {
    return {
      toggle: () => ({ editor }) => {
        const isBoldActive = editor.isActive('bold');
        if (isBoldActive) {
          return editor.commands.unsetMark('bold');
        } else {
          return editor.commands.setMark('bold');
        }
      },
    };
  },
});

const ItalicEditor=Extension.create({
  name:"UnderToggle",

  addCommands(){
    return{
      toggleUnder:()=>({editor})=>{
       const isItalicActive=editor.isActive('italic')
        if(isItalicActive){
          return editor.commands.unsetMark('italic');
        }
        else{
          return editor.commands.setMark('italic');
        }
      }
    }
  }
})




const NewExtension = () => {
  const editor = useEditor({
    extensions: [StarterKit, EmojiExtension, ExportToPDFExtension, BoldEditor,ItalicEditor],
    content: '<p>Start typing here...</p>',
  });

  const handleSentimentAnalysis = () => {
    const currentContent = editor.getHTML();
    const updatedContent = editor.commands.addEmojiBasedOnSentiment(currentContent);
    editor.commands.insertContent(updatedContent);
    editor.chain().focus().run();
  };

  if (!editor) {
    return null; 
  }

  return (
    <div className="flex flex-col items-center p-5 bg-gray-50 min-h-screen">
      {/* Editor Toolbar */}
      <div className="w-full max-w-4xl mb-4 p-2 bg-gray-200 border border-gray-300 rounded-md shadow-md flex justify-between">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-2 rounded hover:bg-gray-300 ${editor.isActive('bold') ? 'bg-gray-400 font-bold' : ''}`}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-2 rounded hover:bg-gray-300 ${editor.isActive('italic') ? 'bg-gray-400 italic' : ''}`}
        >
          Italic
        </button>
        <button
          onClick={handleSentimentAnalysis}
          className="px-3 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
        >
          Analyze Sentiment
        </button>
        <button
          onClick={() => editor.commands.exportToPDF()}
          className="px-3 py-2 rounded bg-green-500 text-white hover:bg-green-600"
        >
          Export to PDF
        </button>
      </div>

      {/* Editor Content */}
      <div className="w-full max-w-4xl border border-gray-300 rounded-md bg-white shadow-md">
        <EditorContent editor={editor} className="p-4 text-gray-800 focus:outline-none" />
      </div>
    </div>
  );
};

export default NewExtension;
