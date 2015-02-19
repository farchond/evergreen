package command

import (
	"io"
	"os"
	"os/exec"
	"strings"
)

type LocalCommand struct {
	CmdString        string
	WorkingDirectory string
	Environment      []string
	ScriptMode       bool
	Stdout           io.Writer
	Stderr           io.Writer
	Cmd              *exec.Cmd
}

func (self *LocalCommand) Run() error {
	err := self.Start()
	if err != nil {
		return err
	}
	return self.Cmd.Wait()
}

func (self *LocalCommand) Start() error {
	var cmd *exec.Cmd
	if self.ScriptMode {
		cmd = exec.Command("sh")
		cmd.Stdin = strings.NewReader(self.CmdString)
	} else {
		cmd = exec.Command("sh", "-c", self.CmdString)
	}

	// create the command, set the options
	if self.WorkingDirectory != "" {
		cmd.Dir = self.WorkingDirectory
	}
	cmd.Env = self.Environment
	if cmd.Env == nil {
		cmd.Env = os.Environ()
	}
	cmd.Stdout = self.Stdout
	cmd.Stderr = self.Stderr

	// cache the command running
	self.Cmd = cmd

	// start the command
	return cmd.Start()
}

func (self *LocalCommand) Stop() error {
	return self.Cmd.Process.Kill()
}

func (self *LocalCommand) PrepToRun(expansions *Expansions) error {
	var err error
	self.CmdString, err = expansions.ExpandString(self.CmdString)
	if err != nil {
		return err
	}
	return nil
}

type LocalCommandGroup struct {
	Commands   []*LocalCommand
	Expansions *Expansions
}

func (self *LocalCommandGroup) PrepToRun() error {
	for _, cmd := range self.Commands {
		if err := cmd.PrepToRun(self.Expansions); err != nil {
			return err
		}
	}
	return nil
}