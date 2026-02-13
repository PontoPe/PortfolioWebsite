// virtual filesystem for the terminal easter egg
export const virtualFS = {
  '/': {
    type: 'dir',
    children: {
      '.lore': {
        type: 'dir',
        children: {
          'truth.txt': {
            type: 'file',
            content: 'The truth is... that truth is subjective. What matters is the journey, not the destination. That also means that you should probably not look for truth or meaning in a random kid\'s portfolio website. But hey, if you\'re here, maybe you\'re the kind of person who enjoys a good rabbit hole. In that case, welcome to the adventure!'
          },
          '.mystery': {
            type: 'dir',
            children: {
              'secret.txt': {
                type: 'file',
                content: 'Oh so its like that huh.... you think I would just use the same dotfile trick twice.... well, you\'re right! But this one is actually a real hidden file. Try listing the contents of this directory with ls -a to find it.'
              },
              '.JustKiddingTheresNothingElseHere': {
                type: 'dir',
                children: {
                  'hidden.txt': {
                    type: 'file',
                    content: 'hmmmm... sneaky!'
                  }
                }
              },
            }
          },
          
        }
      },
      'readme.txt': {
        type: 'file',
        content: 'Welcome to the hidden CLI! Try commands like ls, cd, cat, help.'
      },
      'origin.txt': {
        type: 'file',
        content: 'Long ago, in the digital ether, this portfolio was forged...'
      },
      'about.txt': {
        type: 'file',
        content: 'This is a hidden area for the curious. Enjoy exploring!'
      }
    }
  }
};

export type FSNode = typeof virtualFS['/'];
