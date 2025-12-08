import React, { useEffect, useRef, useState } from 'react';
import styles from './styles.module.css';

const TerminalWindow = () => {
    const terminalRef = useRef(null);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        const terminal = terminalRef.current;
        if (!terminal) return;

        const commands = [
            { 
                type: 'command', 
                text: 'C:\\Users\\Developer> npm run dev',
                delay: 500 
            },
            { 
                type: 'output', 
                text: '\n> laby-blog@1.0.0 dev\n> next dev\n',
                delay: 800 
            },
            { 
                type: 'success', 
                text: '✓ Ready on http://localhost:3000\n',
                delay: 600 
            },
            { 
                type: 'info', 
                text: '○ Compiling /...\n',
                delay: 500 
            },
            { 
                type: 'success', 
                text: '✓ Compiled successfully\n',
                delay: 600 
            },
            { 
                type: 'command', 
                text: '\nC:\\Users\\Developer> node -v',
                delay: 800 
            },
            { 
                type: 'output', 
                text: '\nv18.17.0\n',
                delay: 500 
            },
            { 
                type: 'command', 
                text: '\nC:\\Users\\Developer>',
                delay: 400,
                showCursor: true 
            }
        ];

        let timeoutIds = [];
        let currentDelay = 500;

        const typeCommand = (cmd) => {
            return new Promise((resolve) => {
                const line = document.createElement('div');
                line.className = styles[cmd.type] || styles.output;
                terminal.appendChild(line);

                let charIndex = 0;
                const text = cmd.text;

                const typeChar = () => {
                    if (charIndex < text.length) {
                        line.textContent += text[charIndex];
                        charIndex++;
                        const timeoutId = setTimeout(typeChar, 30);
                        timeoutIds.push(timeoutId);
                    } else {
                        if (cmd.showCursor) {
                            const cursor = document.createElement('span');
                            cursor.className = styles.cursor;
                            line.appendChild(cursor);
                        }
                        resolve();
                    }
                };

                typeChar();
            });
        };

        const runCommands = async () => {
            setIsTyping(true);
            for (const cmd of commands) {
                await new Promise(resolve => {
                    const timeoutId = setTimeout(resolve, cmd.delay);
                    timeoutIds.push(timeoutId);
                });
                await typeCommand(cmd);
            }
            setIsTyping(false);
        };

        runCommands();

        return () => {
            timeoutIds.forEach(id => clearTimeout(id));
        };
    }, []);

    return (
        <div className={styles.terminalContainer}>
            {/* Window Header */}
            <div className={styles.windowHeader}>
                <div className={styles.windowButtons}>
                    <span className={styles.btnClose}></span>
                    <span className={styles.btnMinimize}></span>
                    <span className={styles.btnMaximize}></span>
                </div>
                <div className={styles.windowTitle}>Command Prompt - Developer</div>
                <div className={styles.windowActions}>
                    <span className={styles.actionBtn}>_</span>
                    <span className={styles.actionBtn}>□</span>
                    <span className={styles.actionBtn}>×</span>
                </div>
            </div>

            {/* Terminal Content */}
            <div className={styles.terminalContent}>
                <div className={styles.terminalHeader}>
                    <div className={styles.systemInfo}>
                        Microsoft Windows [Version 10.0.19045.3570]
                    </div>
                    <div className={styles.copyright}>
                        (c) Microsoft Corporation. All rights reserved.
                    </div>
                    <div className={styles.emptyLine}></div>
                </div>
                <div ref={terminalRef} className={styles.terminalOutput}></div>
            </div>
        </div>
    );
};

export default TerminalWindow;
