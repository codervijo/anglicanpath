import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";

// Ported from genai/src/routes/find-a-parish.$parishId.tsx (UpdateDialog).
export function UpdateDialog() {
  return <Dialog>
    <DialogTrigger asChild><Button variant="ghost" className="mt-2 h-11 w-full">Suggest an update</Button></DialogTrigger>
    <DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="font-display text-2xl">Suggest an update</DialogTitle>
        <DialogDescription>This prototype form does not submit information.</DialogDescription>
      </DialogHeader>
      <form className="space-y-4" onSubmit={e => e.preventDefault()}>
        <Input className="h-11" placeholder="Your name" aria-label="Your name"/>
        <Input className="h-11" type="email" placeholder="Email address" aria-label="Email address"/>
        <textarea className="min-h-32 w-full rounded-md border border-input bg-background p-3 text-sm" placeholder="What should be updated?" aria-label="Suggested update"/>
        <Button className="h-11" type="submit">Send suggestion</Button>
      </form>
    </DialogContent>
  </Dialog>;
}

export default UpdateDialog;
