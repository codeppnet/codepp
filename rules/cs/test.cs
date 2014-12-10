using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;
//Download by http://www.codefans.net
namespace CDRForm
{
    public partial class Form1 : Form
    {

        public Form1()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {

        }

        #region 通用事件
        private Point mouse_offset;
        private Point original_pos;
        private void Common_MouseUp(object sender, MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Left)
            {
                Point mousePos = Control.MousePosition;
                mousePos.Offset(mouse_offset.X, mouse_offset.Y);
                //检查是否超出背景图片边界，超出则位置不变；在图片范围内，则控件位置改变。
                if (((Control)sender).Parent.PointToClient(mousePos).X >= 0 && (((Control)sender).Parent.PointToClient(mousePos).X <= ((Control)sender).Parent.BackgroundImage.Size.Width)
                    && (((Control)sender).Parent.PointToClient(mousePos).Y >= 0 && ((Control)sender).Parent.PointToClient(mousePos).Y <= ((Control)sender).Parent.BackgroundImage.Size.Height))
                {
                    ((Control)sender).Location = ((Control)sender).Parent.PointToClient(mousePos);
                    MessageBox.Show(((Control)sender).Location.ToString());
                }
                else
                {
                    ((Control)sender).Location = original_pos;
                }
            }
        }
        private void Common_MouseDown(object sender, MouseEventArgs e)
        {
            mouse_offset = new Point(-e.X, -e.Y);
            original_pos = ((Control)sender).Location;
        }

        private void Common_MouseMove(object sender, MouseEventArgs e)
        {
            ((Control)sender).Cursor = Cursors.Arrow;
            if (e.Button == MouseButtons.Left)
            {
                Point mousePos = Control.MousePosition;
                mousePos.Offset(mouse_offset.X, mouse_offset.Y);
                ((Control)sender).Location = ((Control)sender).Parent.PointToClient(mousePos);
            }
        }
        #endregion

        private void label1_MouseUp(object sender, MouseEventArgs e)
        {
            Common_MouseUp(sender, e);
        }

        private void label1_MouseDown(object sender, MouseEventArgs e)
        {
            Common_MouseDown(sender, e);
        }

        private void label1_MouseMove(object sender, MouseEventArgs e)
        {
            Common_MouseMove(sender, e);
        }

        private void button1_Click(object sender, EventArgs e)
        {
            Label label = new Label();
            label.Text = "  这是label!";
            label.Location = new Point(0,0);
            label.AutoSize = true;
            label.BackColor = System.Drawing.Color.Transparent;
            Image image1 = Image.FromFile("image\\02.gif");
            label.Image = image1;
            label.ImageAlign = System.Drawing.ContentAlignment.MiddleLeft;
            label.MouseMove += new System.Windows.Forms.MouseEventHandler(Common_MouseMove);
            label.MouseDown += new System.Windows.Forms.MouseEventHandler(Common_MouseDown);
            label.MouseUp += new System.Windows.Forms.MouseEventHandler(Common_MouseUp);
            this.splitContainer1.Panel2.Controls.Add(label);
        }

    }
}
