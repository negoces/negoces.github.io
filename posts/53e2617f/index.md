# C语言链表实现


<!--more-->

## 实现思路

假设现在有个三节点的链表,每个节点具有两个指针:

+ prev —— 上一节点地址
+ next —— 下一节点地址

{{< mermaid >}}
graph LR;
    A -->|next| B -->|next| D
    D -->|prev| B -->|prev| A
{{< /mermaid >}}

### 插入节点

注:虚线表示删除,D为插入的节点

{{< mermaid >}}
graph LR;
    A -->|next| B
    B -->|prev| A
    B -->|next| D
    D -->|prev| B
    D -->|next| C
    C -->|prev| D
    B -.->|next| C
    C -.->|prev| B
{{< /mermaid >}}

按照这个图的操作应该是:

```c
C->prev = D
D->next = C
D->prev = B
B->next = D
```

假设此时的链表传入的table是B,插入的node为D,那么C语言代码为:

```c
table->next->prev = node
node->next = table->next
node->prev = table
table->next = node
```
### 删除节点

注:虚线表示删除,B为要删除的节点

{{< mermaid >}}
graph LR;
    A -.->|next| B
    B -.->|prev| A
    B -.->|next| C
    C -.->|prev| B
    A -->|next| C
    C -->|prev| A
{{< /mermaid >}}

按照这个图的操作应该是:

```c
A->next = C
C->prev = A
```

假设此时的链表传入的table是B,那么C语言代码为:

```c
table->prev->next = table->next;
table->next->prev = table->prev;
free(table)
```

## 代码实现

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct node
{
    unsigned int id;   //节点ID
    struct node *prev; //上节点地址
    struct node *next; //下节点地址
} node;

node *createNode(int uid);                      //创建(节点ID)
void addNode(node *table, int uid, int newUid); //增(链表,节点UID,新建节点UID)[在UID节点后插入]
void delNode(node *table, int uid);             //删(链表,节点UID)
void printTable(node *table);                   //打印(链表)

int main()
{
    node *table = createNode(0);
    addNode(table, 0, 1);
    addNode(table, 1, 2);
    addNode(table, 2, 3);
    addNode(table, 3, 4);
    addNode(table, 4, 5);
    addNode(table, 5, 6);
    delNode(table, 1);
    delNode(table, 2);
    delNode(table, 5);
    printTable(table);
    exit(0);
}

node *createNode(int uid)
{
    node *newTable = (node *)malloc(sizeof(node));
    newTable->id = uid;
    newTable->prev = NULL;
    newTable->next = NULL;
    return newTable;
}

void addNode(node *table, int uid, int newUid)
{
    while (1)
    {
        if (table == NULL)
        { //未查找到相应节点
            printf("Node %d not find!\n", uid);
            return;
        }
        if (table->id == newUid)
        { //节点ID已存在
            printf("Node %d exist!\n", newUid);
            return;
        }
        if (table->id == uid)
        { //查找到相应节点
            node *newTable = (node *)malloc(sizeof(node));
            if (table->next != NULL)
            { //如果存在下一节点
                //建立当前与下一链表的联系
                newTable->next = table->next;
                table->next->prev = newTable;
            }
            //建立当前与上一链表的联系
            table->next = newTable;
            newTable->prev = table;
            //写入当前链表ID
            newTable->id = newUid;
            return;
        }
        table = table->next;
    }
}

void delNode(node *table, int uid)
{
    while (1)
    {
        if (table == NULL)
        { //未查找到相应节点
            printf("Node %d not find!\n", uid);
            return;
        }
        if (table->id == uid)
        { //查找到相应节点
            if (table->next != NULL)
            { //如果存在下一节点
                //建立上一节点与下一节点的连接
                table->prev->next = table->next;
                table->next->prev = table->prev;
            }
            else
            { //如果不存在下一节点
                //设置上一节点的next为NULL
                table->prev->next = NULL;
            }
            //释放当前节点
            free(table);
            return;
        }
        table = table->next;
    }
}

void printTable(node *table)
{
    while (table != NULL)
    {
        printf("Node: %d\n", table->id);
        table = table->next;
    }
    return;
}
```
