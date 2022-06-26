- Typescript would be useful to ensure types are properly formed across the codebase.
- Grape may not be the best p2p library -- it looks more fit for a server application where there would be less unexpected networking issues and drop offs etc.
- Sending to specific clients can be done by registering service names with unique ids. -- I ended up implementing this.
- A public p2p network requires MORE validation and DoS protection etc.
- Prevent memory leak: expire orders except for on original client and auto-refresh. I do not delete any orders.
- chosen cli tool crashes when terminal is resized
- TODO: Make clients sync when starting up. -- Did not manage to get it working reliably.
- No security included, it is likely possible to spoof a user or their orders... That said, the implementation of the order itself would probably dictate how to secure it best.

Orders don't sync properly if any of the nodes have been taken down (it works when you spin up clients and test, but as soon as a node is taken down, it no longer works as expected). I wasn't able to work out exactly why, but it wouldn't surprise me if it were to do with not disposing things properly

For speed, I allowed clients to call themselves through grape, but it might be more reliable to not use HTTP to communicate with the local instance.

I would have loved to write tests, but unfortunately, did not get past the prototyping and debugging.

I was playing with folder structures as I went along, but I still think it can be improved.