
```
giftCategory             --礼品类别
````
field name         | field type         | remark 
--------------     | --------------     | ------- 
categoryId         |                    | 礼品类别编号
name               |                    | 礼品类别名称


```
gift                    --礼品
```
field name         | field type         | remark 
--------------     | --------------     | ------- 
giftId             |                    | 礼品编号
brand              |                    | 品牌
name               |                    | 名称
unit               |                    | 计量单位
price              |                    | 单价
expireDate         |                    | 有效期
categoryId         |                    | 礼品类别编号

```
stockOut                --出库
```
field name         | field type         | remark 
--------------     | --------------     | ------- 
soId               |                    | 出库流水号
giftId             |                    | 礼品编号
num                |                    | 数量
amount             |                    | 单笔金额
applyUserId        |                    | 申请人
underDeptId        |                    | 费用承担部门
ptId               |                    | 付款状态编号
soDate             |                    | 出库时间
remark             |                    | 备注
other              |                    | 其他


```
stockIn                --入库
```
field name         | field type         | remark 
--------------     | --------------     | ------- 
siId               |                    | 入库流水号
giftId             |                    | 礼品编号
num                |                    | 数量
amount             |                    | 单笔金额
supplier           |                    | 供应商
siTypeId           |                    | 入库类型编号
ptId               |                    | 付款状态编号
siDate             |                    | 入库时间
remark             |                    | 备注
other              |                    | 其他

```
stockInType             --入库类型(上交、采购、退回)
```
field name         | field type         | remark 
--------------     | --------------     | ------- 
sitId              |                    | 入库类型编号
typeName           |                    | 入库类型名称

```
paymentType            --付款状态（预付、后付）
```
field name         | field type         | remark 
--------------     | --------------     | ------- 
ptId               |                    | 付款状态编号
ptName             |                    | 付款状态名称


```
inventory             --库存（此表被动态维护，不对外提供操作）
```
field name         | field type         | remark 
--------------     | --------------     | ------- 
inventoryId        |                    | 库存编号
giftId             |                    | 礼品编号
num                |                    | 数量 **(联动入库、出库动态维护)**


```
limit                --库存警告
```
field name         | field type         | remark 
--------------     | --------------     | ------- 
giftId             |                    | 礼品编号
limitNum           |                    | 库存下限数量警告
