// Creator: hyphen-nation
// It is open source project
// Create own BIOS system, or own ROM
// I want to see your own creation
// Version 1.0 - Let's contribute to make it better!

(function (Scratch) {
    "use strict"
    if (!Scratch.extensions.unsandboxed) {
        alert("Please import another BIOS extension. Remove this extension, and rewrite the BIOS system and replace it's hooks. This BIOS is not trusted and will not boot up.")
        throw new Error("BIOS error 1 - Failed to load")
    }
    class ROM {
        constructor() {
            this.icon = "〚🟧〛|"
            this.resx = 480
            this.resy = 360
            this.fbuf = new Uint32Array(this.resx * this.resy)
            this.romd = ``
            this.fb = new Uint32Array(this.resx * this.resy)
            this.sfr = 0
        }
        getInfo() {
            return {
                id: "rom",
                name: "All ROM Data",
                color1: "#ff8000",
                color2: "#cf6000",
                color3: "#9f4000",
                blocks: [
                    {
                        opcode: "clr",
                        blockType: Scratch.BlockType.COMMAND,
                        text: `${this.icon} Clear screen`
                    },
                    {
                        opcode: "crm",
                        blockType: Scratch.BlockType.COMMAND,
                        text: `${this.icon} Clear ROM data`
                    },                    
                    {
                        opcode: "frm",
                        blockType: Scratch.BlockType.COMMAND,
                        text: `${this.icon} Execute ROM Frame`
                    },
                    {
                        opcode: "det",
                        blockType: Scratch.BlockType.REPORTER,
                        text: `${this.icon} Get frame DELTA`
                    },
                    {
                        opcode: "loa",
                        blockType: Scratch.BlockType.COMMAND,
                        text: `${this.icon} Load ROM data [rom]`,
                        arguments: {
                            rom: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "let resx=window.gpu_rom.resx,resy=window.gpu_rom.resy;function frame_tick(){let r=new Uint32Array(resx*resy);for(let e=0;e<r.length;e++)r[e]=e%65536;return r}window.frame_tick=frame_tick;"
                            }
                        }
                    },
                    {
                        opcode: "act",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: `${this.icon} is ROM active`
                    }
                ]
            }
        }
        act() {
            return this.romd.length > 0
        }
        clr() {
            this.fbuf.fill(0)
            this.fb.fill(0)
        }
        crm() {
            delete window.gpu_rom
            delete window.frame_tick
            this.romd = ``
            this.fb.fill(0)
            this.fbuf.fill(0)
            this.sfr = 0
        }
        loa(args) {
            if (this.romd) {
                return // Silent ignorance. Silent!
            }
            window.gpu_rom = {}
            window.gpu_rom.resx = this.resx
            window.gpu_rom.resy = this.resy
            this.romd = args.rom
            eval(this.romd)
        }
        frm() {
            if (!this.romd) {
                throw new Error("BIOS error 2 - No ROM detected")
            }
            this.fbuf = window.frame_tick(this.sfr)
            this.sfr++
        }
        det() {
            let delta = new Array(this.fb.length)
            for (let i = 0; i < this.fb.length; i++) {
                delta[i] = this.fb[i] === this.fbuf[i] ? "" : this.fbuf[i]
                this.fb[i] = this.fbuf[i]
            }
            return delta
        }
    }
    console.log("Report bugs or contribute to GitHub page: https://github.com/hyphen-nation/rom-extension")
    Scratch.extensions.register(new ROM())
})(Scratch)
