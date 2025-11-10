## Todo:
 - [x]  Create Auth Context and in that store user details in localStorage and only fetch user data when ever the username changes this will resolve the issue of data retention in dashboard page.

> PS: the first step has been done know based on the data received make sure that the data on the dashboard is saved on changes.
> Also remove the redux store for sharing between dashboard components as they are used inside the form so the form has already access to the data they provide redux store will only add complexity.


 - [x] There is an issue that when the user removes his profile photos and others and then updates the information it does not save it needs to be resolved.

3.  After this check ways to improve navigation speed.

4.  Create a Web Socket connection with the users and the creators so that the payments donated are shared in real time!

5.  Deploy it on Vercel and make sure to use vercel queues in case the database operations are intense and due to cold start the server starts very slowly.

6.  Create a feature in which the creators can see all the analytics relevant to them.
