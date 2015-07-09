# stacks on stacks manager

stack-based todo manager for a mostly automatic task prioritization strategy

todo behavior:
* make it so new tasks are added one below the current task
* new prioritization policy (see below)

todo tech:
* allow for manual dragging tasks around
* share model between server and client
* sync client with server
* mobile website
* use flexbox?

done:
* move to browserify


## new prioritization policy (maybe?)
limit the number of "active" tasks to like 5 or something. any new tasks after that will be added to a "upcoming/backlog" list in filo order.
tasks now have:
- a "do now/promote" button on all tasks that pushes a task to the top
- a "demote" button on the current task that moves it one down or to the bottom of the "active" list
- a "bury" button on all "active" tasks that sends it to the bottom of to "upcoming/backlog" list.