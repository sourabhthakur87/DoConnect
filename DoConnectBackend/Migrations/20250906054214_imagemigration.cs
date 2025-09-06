using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DoConnectBackend.Migrations
{
    /// <inheritdoc />
    public partial class imagemigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "answerId",
                table: "Images",
                type: "int",
                nullable: true,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Images_answerId",
                table: "Images",
                column: "answerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Images_Answers_answerId",
                table: "Images",
                column: "answerId",
                principalTable: "Answers",
                principalColumn: "answerId",
                onDelete: ReferentialAction.NoAction);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Images_Answers_answerId",
                table: "Images");

            migrationBuilder.DropIndex(
                name: "IX_Images_answerId",
                table: "Images");

            migrationBuilder.DropColumn(
                name: "answerId",
                table: "Images");
        }
    }
}
