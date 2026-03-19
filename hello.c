#include <stdio.h>
#include <stdlib.h>

struct node
{
    int data;
    struct node *next;
};

int countNodes(struct node *head)
{
    int count = 0;
    struct node *temp = head;

    while(temp != NULL)
    {
        count++;
        temp = temp->next;
    }
    return count;
}
int searchnodes(struct node *head){
    int key;
    printf("Enter the value of key");
    scanf("%d",&key);
    struct info *newnode=head;
    struct  node *temp=head;
    
    while(temp!=NULL){
      if(key==newnode)
      {
        return 1;
      }else{
        temp=temp->next;
      }
    }
    return -1;

}
int insert(struct node *head){
struct node *temp=head;
int item;
printf("Enter the item");
scanf("%d",&item);
while(temp!=NULL){
    
}
}

int main()
{
    struct node *head = NULL, *newnode, *temp;
    int n, i;

    printf("Enter number of nodes: ");
    scanf("%d", &n);

    for(i = 0; i < n; i++)
    {
        newnode = (struct node*)malloc(sizeof(struct node));
        printf("Enter data: ");
        scanf("%d", &newnode->data);
        newnode->next = NULL;

        if(head == NULL)
        {
            head = newnode;
            temp = newnode;
        }
        else
        {
            temp->next = newnode;
            temp = newnode;
        }
    }

    printf("Number of nodes = %d", countNodes(head));
    printf("%d",searchnodes(head));

    return 0;
}





































